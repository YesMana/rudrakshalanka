"use client";

import styles from '../page.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function Privacy() {
  const { locale } = useLanguage();

  const content = {
    en: {
      title: "Privacy Policy",
      p1: "We respect your privacy. Rudraksha Lanka collects personal details (Name, Delivery Address, Phone Numbers) exclusively to securely process checkouts and dispatch parcels via our shipping partners.",
      p2: "Your tracking and billing information is never shared, leased, or sold to third-party commercial marketing entities. Meta Pixel triggers are integrated solely to optimize user experience and evaluate marketing operations safely."
    },
    si: {
      title: "රහස්‍යතා ප්‍රතිපත්තිය",
      p1: "ඔබගේ රහස්‍යභාවය සුරැකීමට අප බැඳී සිටිමු. Rudraksha Lanka වෙබ් අඩවිය මගින් ලබාගන්නා ඔබගේ නම, ලිපිනය සහ දුරකථන අංක භාවිතා කරනු ලබන්නේ ඔබගේ ඇණවුම නිවැරදිව නිවසටම එවීමට (Delivery) පමණි.",
      p2: "ඔබගේ කිසිදු පෞද්ගලික තොරතුරක් බාහිර පාර්ශවයන් වෙත විකිණීම හෝ ලබාදීම කිසිසේත්ම සිදු නොකරයි."
    },
    ta: {
      title: "தனியுரிமைக் கொள்கை",
      p1: "உங்களின் தனியுரிமையை நாங்கள் மதிக்கிறோம். Rudraksha Lanka இணையதளத்தின் மூலம் சேகரிக்கப்படும் உங்களின் பெயர், முகவரி மற்றும் தொலைபேசி எண்கள் உங்கள் ஆர்டர்களை வீட்டிற்கு விநியோகிப்பதற்காக (Delivery) மட்டுமே பயன்படுத்தப்படும்.",
      p2: "உங்கள் தனிப்பட்ட விபரங்கள் எந்தவொரு வெளித்தரப்பினருக்கும் பகிரப்படமாட்டாது."
    }
  };

  const current = content[locale] || content.en;

  return (
    <div className={styles.container} style={{ paddingTop: '100px', paddingBottom: '60px', minHeight: '80vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px', color: '#fff' }}>
        <h1 className={styles.sectionTitle} style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
          {current.title}
        </h1>
        
        <div style={{ 
          background: 'rgba(20, 20, 20, 0.8)', 
          border: '1px solid rgba(212, 175, 55, 0.3)', 
          borderRadius: '16px', 
          padding: '2.5rem', 
          lineHeight: '1.8',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(212,175,55,0.05)'
        }}>
          <p style={{ marginBottom: '1.8rem', color: '#eaeaea', fontSize: '1.1rem', textAlign: 'justify' }}>
            {current.p1}
          </p>
          {current.p2 && (
            <p style={{ color: '#eaeaea', fontSize: '1.1rem', textAlign: 'justify' }}>
              {current.p2}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
