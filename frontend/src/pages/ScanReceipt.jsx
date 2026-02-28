import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle, Save, X, RotateCw, FileText } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Loader } from '../components/ui/Loader';
import { scanReceipt, createProductFromScan, uploadDocument } from '../services/api';

const ScanReceipt = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [step, setStep] = useState('upload'); // upload -> scanning -> review -> success
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        setFile(file);
        setPreview(URL.createObjectURL(file));
        setStep('scanning');
        performScan(file);
    };

    const performScan = async (file) => {
        setIsScanning(true);
        try {
            // Simulate scan delay for UX if API is too fast
            await new Promise(resolve => setTimeout(resolve, 1500));

            const result = await scanReceipt(file);
            setScannedData(result.editable);
            setStep('review');
        } catch (error) {
            console.error("Scan failed", error);
            alert("Failed to scan receipt. Please try again.");
            setStep('upload');
            setFile(null);
            setPreview(null);
        } finally {
            setIsScanning(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // 1. Create Product & Warranty
            const productRes = await createProductFromScan(scannedData);
            const productId = productRes.data[0].id; // Adjust based on actual response structure

            // 2. Upload Receipt Image
            if (file && productId) {
                await uploadDocument(productId, file);
            }

            setStep('success');
        } catch (error) {
            console.error("Save failed", error);
            alert("Failed to save product.");
        }
    };

    const reset = () => {
        setFile(null);
        setPreview(null);
        setScannedData(null);
        setStep('upload');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col gap-2 text-center md:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Scan Receipt</h1>
                <p className="text-slate-500">Upload your bill and let AI extract the details.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Left: Upload Area */}
                <Card className={`h-96 flex flex-col items-center justify-center border-2 border-dashed transition-all ${dragActive ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200'} ${step === 'success' ? 'opacity-50 pointer-events-none' : ''}`}>

                    {step === 'upload' && (
                        <div
                            className="text-center p-8 w-full h-full flex flex-col items-center justify-center cursor-pointer"
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current.click()}
                        >
                            <div className="bg-indigo-50 p-4 rounded-full mb-4">
                                <UploadCloud className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">Click to upload or drag and drop</h3>
                            <p className="text-sm text-slate-500 mt-2">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                onChange={handleChange}
                                accept="image/*"
                            />
                        </div>
                    )}

                    {(step === 'scanning' || step === 'review' || step === 'success') && preview && (
                        <div className="relative w-full h-full p-4">
                            <img src={preview} alt="Receipt Preview" className="w-full h-full object-contain rounded-lg" />
                            {step === 'review' && (
                                <button
                                    onClick={reset}
                                    className="absolute top-2 right-2 p-1 bg-white/80 rounded-full shadow-sm hover:bg-white text-slate-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    )}
                </Card>

                {/* Right: Steps & Result */}
                <div className="space-y-6">
                    <AnimatePresence mode="wait">
                        {step === 'upload' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                            >
                                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-indigo-600" />
                                    Instructions
                                </h3>
                                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                                    <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Ensure good lighting</li>
                                    <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Capture whole receipt</li>
                                    <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Avoid blurriness</li>
                                </ul>
                            </motion.div>
                        )}

                        {step === 'scanning' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-slate-100 h-full"
                            >
                                <Loader />
                                <p className="mt-4 text-slate-600 font-medium animate-pulse">Analyzing receipt...</p>
                            </motion.div>
                        )}

                        {step === 'review' && scannedData && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Review Details</CardTitle>
                                        <CardDescription>Confirm the extracted information before saving.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700">Product Name</label>
                                                <Input
                                                    value={scannedData.product_name}
                                                    onChange={(e) => setScannedData({ ...scannedData, product_name: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700">Brand</label>
                                                <Input
                                                    value={scannedData.brand}
                                                    onChange={(e) => setScannedData({ ...scannedData, brand: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700">Purchase Date</label>
                                                <Input
                                                    type="date"
                                                    value={scannedData.purchase_date || ''}
                                                    onChange={(e) => setScannedData({ ...scannedData, purchase_date: e.target.value })}
                                                />
                                            </div>
                                        </form>
                                    </CardContent>
                                    <div className="p-6 pt-0 flex gap-3">
                                        <Button variant="outline" onClick={reset} className="flex-1">Retry</Button>
                                        <Button onClick={handleSave} className="flex-1 gap-2">
                                            <Save className="h-4 w-4" /> Save
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {step === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center"
                            >
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-emerald-900">Success!</h2>
                                <p className="text-emerald-700 mt-2">Product has been added and warranty activated.</p>
                                <Button className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={reset}>
                                    Scan Another
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ScanReceipt;
