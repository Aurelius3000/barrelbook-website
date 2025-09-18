"use client";

import { Users } from "lucide-react";
import { Button } from "./ui/button";

export interface WelcomeScreenProps {
  onCreateAccount?: () => void;
  onSignIn?: () => void;
  onContinueAsGuest?: () => void;
}

export function WelcomeScreen({ onCreateAccount, onSignIn, onContinueAsGuest }: WelcomeScreenProps) {
  return (
    <div className="max-w-sm mx-auto min-h-screen bg-black">
      <div className="flex justify-between items-center px-6 pt-3 pb-1 text-white">
        <div className="flex items-center gap-1">
          <div className="text-sm">4:17</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-4 bg-white rounded-full"></div>
            <div className="w-1 h-4 bg-white rounded-full"></div>
            <div className="w-1 h-4 bg-white rounded-full"></div>
            <div className="w-1 h-4 bg-white/40 rounded-full"></div>
          </div>
          <div className="text-xs ml-1">43</div>
        </div>
      </div>

      <div className="px-6 flex flex-col min-h-[calc(100vh-60px)]">
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <div className="w-20 h-20 mb-12">
            <div className="relative">
              <div className="w-16 h-20 border-2 border-gray-300 rounded-b-lg mx-auto bg-transparent"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-gradient-to-t from-amber-600 to-amber-500 rounded-b-lg"></div>
            </div>
          </div>

          <h1 className="text-white text-3xl mb-2 tracking-wide">BARRELBOOK</h1>
          <p className="text-gray-400 text-lg mb-16">Your Personal Whiskey Collection</p>

          <Button
            onClick={onCreateAccount}
            className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-lg mb-6 flex items-center justify-center gap-2"
          >
            <Users className="w-5 h-5" />
            Create Account
          </Button>

          <div className="space-y-2 mb-8">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-400">Your collection is saved forever</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-400">Syncs across all your devices</span>
            </div>
          </div>

          <button
            onClick={onSignIn}
            className="text-amber-400 hover:text-amber-300 text-base mb-12"
          >
            Already have an account? Sign In
          </button>

          <Button
            onClick={onContinueAsGuest}
            variant="ghost"
            className="w-full py-4 text-gray-400 hover:text-gray-300 hover:bg-gray-800/30 text-lg mb-8"
          >
            Continue as Guest
          </Button>

          <div className="flex items-center gap-4 w-full mb-8">
            <div className="flex-1 h-px bg-gray-600"></div>
            <div className="flex-1 h-px bg-gray-600"></div>
          </div>
        </div>

        <div className="pb-8 text-center">
          <p className="text-gray-500 text-sm">
            By continuing, you agree to our{" "}
            <span className="text-amber-400">Terms of Service</span>{" "}
            and{" "}
            <span className="text-amber-400">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;


