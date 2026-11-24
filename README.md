# Wrap-stick – Gourmet Restaurant Website & Admin Dashboard

**Location:** Manoj Kulhari Thekedar Farmhouse, Gudha Gorji, Jhunjhunu, Rajasthan  
**Contact / WhatsApp:** +91 7597386371

## Architecture Overview
- `src/constants/orderConfig.js` — Shared order window constants, phone normalizer, and cancellation rules
- `src/services/firestoreService.js` — Centralized Firestore subscriptions & atomic `writeBatch` operations
- `src/hooks/usePhoneOtp.js` & `src/hooks/useOrderCountdown.js` — Reusable OTP verification and 5-minute countdown hooks
- `src/components/booking/` — Modular multi-step booking UI (`BookingStepItems`, `BookingStepSchedule`, `BookingStepReview`, `BookingStepConfirmed`)
- `src/App.jsx` — Code-split admin dashboard routes via `React.lazy` & `Suspense`

## Quick Start
```bash
cp .env.example .env
npm install
npm run dev
```
