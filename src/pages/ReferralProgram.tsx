
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { useReferral } from '@/contexts/referral/ReferralContext';
import ReferralHeader from '@/components/referral/ReferralHeader';
import PremiumStatus from '@/components/referral/PremiumStatus';
import ReferralStats from '@/components/referral/ReferralStats';
import ReferralCodeCard from '@/components/referral/ReferralCodeCard';
import RewardsCard from '@/components/referral/RewardsCard';
import ReferralHistory from '@/components/referral/ReferralHistory';

const ReferralProgram: React.FC = () => {
  const { userPlan } = useAuth();
  const { 
    referralCode, 
    totalReferrals, 
    referralsNeeded, 
    referralHistory, 
    isPremium,
    premiumExpiry,
    isLoading,
    generateReferralCode,
    shareReferralLink,
    copyReferralCode
  } = useReferral();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <ReferralHeader />
        
        <PremiumStatus isPremium={isPremium} premiumExpiry={premiumExpiry} />
        
        <ReferralStats 
          totalReferrals={totalReferrals} 
          referralsNeeded={referralsNeeded} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ReferralCodeCard
            referralCode={referralCode}
            totalReferrals={totalReferrals}
            referralsNeeded={referralsNeeded}
            isLoading={isLoading}
            onGenerateCode={generateReferralCode}
            onCopyCode={copyReferralCode}
            onShareLink={shareReferralLink}
          />

          <RewardsCard referralsNeeded={referralsNeeded} />
        </div>

        <ReferralHistory referralHistory={referralHistory} />
      </div>
    </div>
  );
};

export default ReferralProgram;
