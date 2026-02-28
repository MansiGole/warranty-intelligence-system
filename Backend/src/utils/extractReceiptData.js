export function extractReceiptData(text) {
  // Normalize text for processing
  const lowerText = text.toLowerCase();
  const lines = text.split('\n').filter(line => line.trim().length > 0);

  // Address Keywords Blocklist (to aggressively filter out address lines)
  const addressKeywords = ["road", "street", "block", "floor", "nagar", "city", "state", "india", "pvt", "ltd", "invoice", "gst", "shipping", "billing", "cross", "layout", "bangalore", "mumbai", "delhi", "sold by", "ship to", "bill to"];

  // -------- BRAND / STORE NAME --------
  let brand = "Unknown";
  if (lowerText.includes("amazon")) brand = "Amazon";
  else if (lowerText.includes("flipkart")) brand = "Flipkart";
  else if (lowerText.includes("croma")) brand = "Croma";
  else if (lowerText.includes("reliance")) brand = "Reliance Digital";
  else if (lowerText.includes("varasiddhi")) brand = "Varasiddhi Silk Exports";
  else if (lowerText.includes("myntra")) brand = "Myntra";
  else if (lowerText.includes("ajio")) brand = "Ajio";
  else if (lowerText.includes("apple")) brand = "Apple Store";
  else if (lowerText.includes("samsung")) brand = "Samsung Store";

  // -------- PURCHASE DATE --------
  let purchase_date = "";
  // Flexible Regex for DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY, allowing spaces
  // Matches: 28.10.2019, 28-10-2019, 28 / 10 / 2019
  const dateRegex = /\b(\d{1,2})\s*[./-]\s*(\d{1,2})\s*[./-]\s*(\d{4})\b/;
  let match = text.match(dateRegex);

  if (match) {
    const day = match[1].padStart(2, '0');
    const month = match[2].padStart(2, '0');
    const year = match[3];
    purchase_date = `${year}-${month}-${day}`;
  } else {
    // Check for ISO Format: YYYY-MM-DD
    const isoDateRegex = /\b(\d{4})\s*[./-]\s*(\d{1,2})\s*[./-]\s*(\d{1,2})\b/;
    match = text.match(isoDateRegex);
    if (match) {
      const year = match[1];
      const month = match[2].padStart(2, '0');
      const day = match[3].padStart(2, '0');
      purchase_date = `${year}-${month}-${day}`;
    }
  }

  // -------- PRODUCT NAME (Improved Heuristic) --------
  let product_name = "";

  // Strategy 1: Look for "Description" header and take the next line
  const headerKeywords = ["description", "item", "product", "particulars"];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();

    // Check if line is a header row
    if (headerKeywords.some(keyword => line.includes(keyword)) &&
      (line.includes("qty") || line.includes("price") || line.includes("amount") || line.includes("rate") || line.includes("total"))) {

      // The NEXT line is likely the product, BUT verify it's not an address
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        const isAddress = addressKeywords.some(k => nextLine.toLowerCase().includes(k));

        if (nextLine.length > 5 && !nextLine.toLowerCase().includes("total") && !isAddress) {
          product_name = cleanLine(nextLine);
          break;
        }
      }
    }
  }

  // Strategy 2: If finding by header failed, look for known product keywords
  if (!product_name) {
    const productKeywords = ["iphone", "macbook", "galaxy", "pixel", "laptop", "watch", "tv", "monitor", "headphone", "earbuds", "camera", "playstation", "xbox", "nintendo", "saree", "silk", "shirt", "pant", "jeans", "top"];
    for (const keyword of productKeywords) {
      if (lowerText.includes(keyword)) {
        // Find line with keyword
        const line = lines.find(l => {
          const lowerL = l.toLowerCase();
          return lowerL.includes(keyword) && !addressKeywords.some(addr => lowerL.includes(addr));
        });

        if (line) {
          product_name = cleanLine(line);
          break;
        }
      }
    }
  }

  // Strategy 3: General Heuristic for typical "Product Line" look (longest valid line)
  // Expanded to run for ALL brands if nothing else found, not just Amazon
  if (!product_name) {
    const candidates = lines.filter(line => {
      const l = line.toLowerCase();
      const isAddress = addressKeywords.some(k => l.includes(k));
      const isTotal = l.includes("total") || l.includes("amount") || l.includes("thank") || l.includes("visit");

      // Must have text, be reasonably long, and NOT be an address/total line
      return !isAddress && !isTotal && line.length > 15 && /[a-zA-Z]/.test(line);
    });

    if (candidates.length > 0) {
      // Sort by length descending, as product descriptions are often long
      candidates.sort((a, b) => b.length - a.length);
      product_name = cleanLine(candidates[0]);
    }
  }

  // Fallback
  if (!product_name) {
    product_name = "Unknown Product";
  }

  return {
    product_name: product_name.slice(0, 100),
    purchase_date,
    brand
  };
}

function cleanLine(line) {
  // Remove starting serial numbers (e.g. "1.", "1 ")
  let clean = line.replace(/^\d+[\.\s]+/, '');

  // Remove prices/quantities from end (e.g. "12.00 500.00")
  clean = clean.replace(/[\d.,]+\s*$/, '').trim();

  // Remove leading/trailing special chars
  return clean.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
}
