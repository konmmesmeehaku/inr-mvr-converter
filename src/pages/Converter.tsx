import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const USD_TO_INR = 97.80;
const USD_TO_MVR = 15.42;
const INR_TO_MVR = USD_TO_MVR / USD_TO_INR;

function fmt(n: number, decimals = 2) {
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export default function Converter() {
  const [inrInput, setInrInput] = useState("");
  const [profit, setProfit] = useState(10);
  const [dragging, setDragging] = useState(false);

  const inrAmount = parseFloat(inrInput) || 0;
  const baseMVR = inrAmount * INR_TO_MVR;
  const profitMVR = baseMVR * (profit / 100);
  const finalMVR = baseMVR + profitMVR;

  const handleInrChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, "");
    setInrInput(val);
  }, []);

  const hasValue = inrAmount > 0;

  const QUICK_PROFITS = [5, 10, 15, 20, 25];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-4">
            <span className="text-xs text-indigo-300 font-medium tracking-wide uppercase">Currency Converter</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">INR → MVR</h1>
          <p className="text-sm text-slate-400">Indian Rupee to Maldivian Rufiyaa</p>
        </motion.div>

        {/* Rate pill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <span className="text-xs text-slate-500 font-mono">1 USD = ₹{USD_TO_INR}</span>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <span className="text-xs text-slate-500 font-mono">1 USD = ৳{USD_TO_MVR} MVR</span>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <span className="text-xs text-indigo-400 font-mono font-semibold">1 ₹ = {INR_TO_MVR.toFixed(4)} ৳</span>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, type: "spring", stiffness: 120 }}
          className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
        >

          {/* INR Input */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
              Amount in Indian Rupees
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-400 font-light select-none">₹</span>
              <input
                type="text"
                inputMode="decimal"
                value={inrInput}
                onChange={handleInrChange}
                placeholder="0.00"
                className="w-full bg-white/[0.07] border border-white/10 rounded-2xl pl-10 pr-4 py-4 text-2xl font-bold text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
              />
            </div>
          </div>

          {/* Profit Slider */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Profit Margin
              </label>
              <motion.span
                key={profit}
                initial={{ scale: 1.3, color: "#818cf8" }}
                animate={{ scale: 1, color: "#e2e8f0" }}
                transition={{ duration: 0.2 }}
                className="text-xl font-bold text-slate-200"
              >
                {profit}%
              </motion.span>
            </div>

            {/* Custom slider */}
            <div className="relative mb-3">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                  style={{ width: `${(profit / 50) * 100}%` }}
                  layout
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={50}
                step={0.5}
                value={profit}
                onChange={(e) => setProfit(parseFloat(e.target.value))}
                onMouseDown={() => setDragging(true)}
                onMouseUp={() => setDragging(false)}
                onTouchStart={() => setDragging(true)}
                onTouchEnd={() => setDragging(false)}
                className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
              />
            </div>

            {/* Quick-select chips */}
            <div className="flex gap-2">
              {QUICK_PROFITS.map((p) => (
                <button
                  key={p}
                  onClick={() => setProfit(p)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    profit === p
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                      : "bg-white/[0.06] text-slate-400 hover:bg-white/10 hover:text-slate-200"
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 my-5" />

          {/* Results */}
          <AnimatePresence mode="wait">
            {hasValue ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {/* Cost row */}
                <div className="flex items-center justify-between bg-white/[0.04] rounded-2xl px-4 py-3">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Your cost</p>
                    <p className="text-xs text-slate-600 mt-0.5">₹{fmt(inrAmount)} converted</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-300">৳ {fmt(baseMVR)}</p>
                    <p className="text-xs text-slate-500">MVR</p>
                  </div>
                </div>

                {/* Profit row */}
                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-4 py-3">
                  <div>
                    <p className="text-xs text-emerald-400 font-medium">Your profit</p>
                    <p className="text-xs text-emerald-500/60 mt-0.5">{profit}% on top</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-400">+ ৳ {fmt(profitMVR)}</p>
                    <p className="text-xs text-emerald-500/60">MVR</p>
                  </div>
                </div>

                {/* Final price */}
                <div className="flex items-center justify-between bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 rounded-2xl px-4 py-4">
                  <div>
                    <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wide">Charge your friend</p>
                    <p className="text-xs text-indigo-400/60 mt-0.5">Final price in MVR</p>
                  </div>
                  <div className="text-right">
                    <motion.p
                      key={`${inrAmount}-${profit}`}
                      initial={{ scale: 1.05, opacity: 0.6 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.25, type: "spring", stiffness: 200 }}
                      className="text-2xl font-bold text-white"
                    >
                      ৳ {fmt(finalMVR)}
                    </motion.p>
                    <p className="text-xs text-indigo-300/60">MVR</p>
                  </div>
                </div>

                {/* Summary line */}
                <p className="text-center text-xs text-slate-500 pt-1">
                  You pay <span className="text-slate-400 font-medium">₹{fmt(inrAmount)}</span> → friend pays{" "}
                  <span className="text-indigo-400 font-semibold">৳{fmt(finalMVR)} MVR</span> → you earn{" "}
                  <span className="text-emerald-400 font-semibold">৳{fmt(profitMVR)}</span>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-6"
              >
                <div className="text-4xl mb-3 opacity-30">₹</div>
                <p className="text-sm text-slate-500">Enter an amount above to see the conversion</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-slate-600 mt-5"
        >
          Exchange rate: 1 USD = ₹{USD_TO_INR} INR · 1 USD = ৳{USD_TO_MVR} MVR
        </motion.p>
      </div>
    </div>
  );
}
