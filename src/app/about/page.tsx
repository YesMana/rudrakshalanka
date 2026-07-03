"use client";

import styles from '../page.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function About() {
  const { locale } = useLanguage();

  const content = {
    en: {
      title: "Welcome to Rudraksha Lanka",
      p1: "At Rudraksha Lanka, we are dedicated to bringing the pure, divine, and transformational energy of authentic spiritual beads directly to your doorstep. As Sri Lanka's trusted destination for spiritual wellness, we specialize in sourcing and providing 100% natural, premium-grade Mukhi Rudraksha beads, beautifully crafted necklaces (Malas), and sacred pendants such as the gold-toned Trishula and Om alignments.",
      p2: "Driven by integrity, authenticity, and premium craftsmanship, we operate a seamless nationwide e-commerce network with flexible cash on delivery (COD) choices, ensuring safe and direct access to divine blessings across Sri Lanka.",
      web: "Website: www.rudrakshalanka.com",
      hotline: "Hotlines: 071 990 9299 / 071 339 0400"
    },
    si: {
      title: "Rudraksha Lanka වෙත ඔබව සාදරයෙන් පිළිගනිමු",
      p1: "Rudraksha Lanka අපගේ පරමාර්ථය වන්නේ උතුම් වූත්, පවිත්‍ර වූත් ආධ්‍යාත්මික ශක්තිය කැටි වූ සැබෑ රුද්‍රාක්ෂ මාල සහ පෙන්ඩන්ට්ස් ඉතාමත් විශ්වාසවන්තව ඔබ වෙත සමීප කිරීමයි. ශ්‍රී ලංකාවේ ආධ්‍යාත්මික සුවතාවය සහ මානසික ඒකාග්‍රතාවය සොයන ඔබ වෙනුවෙන්ම 100% ක්ම ස්වභාවික, ඉහළම ගුණාත්මකභාවයෙන් යුත් මුඛී (Mukhi) රුද්‍රාක්ෂ බීජ සහ රන්වන් පැහැති ත්‍රිශූල සහ ඕම් පෙන්ඩන්ට්ස් සහිත ප්‍රිමියම් මාල එකතුවක් අප සතුය.",
      p2: "විශ්වාසය, ගුණාත්මකභාවය සහ විශිෂ්ට පාරිභෝගික සේවාව පෙරදැරි කරගත් අප, මුළු දිවයිනම ආවරණය වන පරිදි නිවසටම ගෙන්වාගෙන මුදල් ගෙවීමේ (Cash on Delivery) පහසුකම් සහිතව සේවාවන් සපයන්නෙමු.",
      web: "වෙබ් අඩවිය: www.rudrakshalanka.com",
      hotline: "දුරකථන: 071 990 9299 / 071 339 0400"
    },
    ta: {
      title: "Rudraksha Lanka ஹிற்கு உங்களை அன்புடன் வரவேற்கிறோம்",
      p1: "Rudraksha Lanka வில், தூய்மையான மற்றும் தெய்வீக ஆற்றல் கொண்ட நிஜமான ஆன்மீக மாலைகளை உங்களிடம் கொண்டு சேர்ப்பதில் நாங்கள் அர்ப்பணிப்புடன் செயல்படுகிறோம். இலங்கையில் ஆன்மீக நல்வாழ்விற்கான உங்கள் நம்பகமான இடமாக விளங்கும் நாங்கள், 100% இயற்கையான, உயர்தர முகி (Mukhi) ருத்ராட்ச மணிகள், தங்க நிற திரிசூலம் மற்றும் ஓம் பதக்கங்கள் (Pendants) கொண்ட பிரீமியம் மாலைகளை வழங்குவதில் நிபுணத்துவம் பெற்றுள்ளோம்.",
      p2: "நம்பகத்தன்மை மற்றும் சிறந்த கைவினைத்திறன் ஆகியவற்றால் இயக்கப்படும் நாங்கள், இலங்கை முழுவதும் Cash on Delivery (COD) வசதியுடன் உங்கள் வீட்டிற்கே விநியோகிக்கும் சேவையை வழங்குகிறோம்.",
      web: "இணையதளம்: www.rudrakshalanka.com",
      hotline: "தொலைபேசி: 071 990 9299 / 071 339 0400"
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
          <p style={{ marginBottom: '2.5rem', color: '#eaeaea', fontSize: '1.1rem', textAlign: 'justify' }}>
            {current.p2}
          </p>
          
          <div style={{ 
            borderTop: '1px solid rgba(212, 175, 55, 0.2)', 
            paddingTop: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
            color: 'var(--color-gold)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2rem' }}>🌐</span> 
              <strong>{current.web}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2rem' }}>📞</span> 
              <strong>{current.hotline}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
