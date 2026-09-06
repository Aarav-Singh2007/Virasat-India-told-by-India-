import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import type { ArtisanData } from "@/data/states";
import Image from "next/image";
import Script from "next/script";

interface ProductPageProps {
  isOpen: boolean;
  artisan: ArtisanData;
  onClose: () => void;
}

export function ArtisanProductPage({ isOpen, artisan, onClose }: ProductPageProps) {
  const [checkoutStep, setCheckoutStep] = useState<"product" | "confirmed">("product");

  // Reset state when reopened
  React.useEffect(() => {
    if (isOpen) {
      setCheckoutStep("product");
    }
  }, [isOpen]);

  const handleAddToCart = () => {
    setCheckoutStep("confirmed");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#F9F6F0] font-sans"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
        >
          <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js" strategy="lazyOnload" />
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white border border-[#EAE3D9] text-[#2A241F] hover:bg-[#F0EBE1] transition-all shadow-sm"
            aria-label="Close product page"
          >
            <X size={24} />
          </button>

          {checkoutStep === "product" ? (
            <div className="w-full max-w-5xl h-full md:h-[80vh] bg-white md:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-[#EAE3D9]">
              {/* Images Section */}
              <div className="w-full md:w-1/2 bg-[#F5F2EC] p-8 flex flex-col justify-center items-center relative">
                <div className="w-full h-64 md:h-96 bg-[#EAE3D9] rounded-2xl mb-4 relative overflow-hidden border border-[#DCD3C6]">
                  {/* AR Model Viewer */}
                  <div
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{
                      __html: `<model-viewer src="/models/rajasthan-item.glb" ar ar-modes="webxr scene-viewer quick-look" camera-controls auto-rotate style="width: 100%; height: 100%;"></model-viewer>`
                    }}
                  />
                </div>
                <div className="flex gap-4 w-full">
                  <div className="flex-1 h-24 bg-[#EAE3D9] rounded-xl relative overflow-hidden border border-[#DCD3C6]">
                    <div className="absolute inset-0 flex items-center justify-center text-[#8B7D6B] text-xs font-serif italic text-center px-2">
                      [ Detail Image 2 ]
                    </div>
                  </div>
                  <div className="flex-1 h-24 bg-[#EAE3D9] rounded-xl relative overflow-hidden border border-[#DCD3C6]">
                    <div className="absolute inset-0 flex items-center justify-center text-[#8B7D6B] text-xs font-serif italic text-center px-2">
                      [ Detail Image 3 ]
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details Section */}
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto">
                <p className="text-[#A23E33] text-sm font-bold tracking-widest uppercase mb-2">
                  Handcrafted in {artisan.state}
                </p>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2A241F] mb-4">
                  Authentic Block-Printed Textile
                </h2>
                
                <p className="text-2xl text-[#2A241F] font-medium mb-8">
                  ₹ 1,450 <span className="text-sm text-[#8B7D6B] font-normal ml-2">incl. all taxes</span>
                </p>

                <div className="bg-[#F9F6F0] p-6 rounded-2xl mb-8 border border-[#EAE3D9]">
                  <h4 className="text-lg font-bold text-[#2A241F] font-serif mb-3">Where this comes from</h4>
                  <p className="text-[#4A433A] text-sm leading-relaxed mb-4">
                    This product is sourced directly through an artisan cooperative model, structured similarly to a Farmer Producer Organisation (FPO). 
                  </p>
                  <p className="text-[#4A433A] text-sm leading-relaxed">
                    By operating as a collective, artisans pool their resources, purchase raw materials in bulk, and eliminate middlemen. This ensures that the creators retain a significantly larger share of the final sale price, empowering rural economies and keeping traditional crafts financially viable for the next generation.
                  </p>
                </div>

                <div className="mt-auto">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-4 bg-[#A23E33] hover:bg-[#8a3329] text-white font-bold text-lg rounded-xl shadow-lg shadow-[#A23E33]/20 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <motion.div 
              className="text-center p-12 bg-white rounded-3xl shadow-xl max-w-md w-full border border-[#EAE3D9]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="w-20 h-20 bg-[#F5F2EC] text-[#A23E33] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#2A241F] mb-3">
                Added to Cart!
              </h2>
              <p className="text-[#4A433A] mb-8">
                Your purchase supports {artisan.name} and the artisan cooperative.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 bg-[#EAE3D9] hover:bg-[#DCD3C6] text-[#2A241F] font-bold rounded-xl transition-colors"
              >
                Return to Journey
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
