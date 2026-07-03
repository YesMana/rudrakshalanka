"use client";

import styles from '../page.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function Terms() {
  const { locale } = useLanguage();

  const content = {
    en: {
      title: "Return & Exchange Policy",
      p1: "At Rudraksha Lanka, we guarantee the distribution of 100% authentic spiritual products. Due to the sacred and organic nature of natural Mukhi beads, all sales are final. Exchanges are governed strictly by the following protections:",
      eligibility: "Eligibility",
      eligibilityText: "Exchanges are strictly permitted ONLY if the product has a verified manufacturing defect upon arrival or if the incorrect item was dispatched.",
      noMindChange: "No Mind-Change",
      noMindChangeText: "Returns or exchanges due to a customer's change of mind, personal taste, or spiritual expectations are strictly rejected.",
      timeframe: "Timeframe",
      timeframeText: "Claims must be initiated within exactly fourteen (14) days from the documented date of delivery. Any request exceeding 14 days is legally void.",
      condition: "Condition",
      conditionText: "The item must remain entirely unworn, unaltered, and enclosed inside its original protective packaging.",
      logistics: "Logistics",
      logisticsText: "Delivery charges for verified errors will be covered by us. In any other approved standard context, shipping costs remain the responsibility of the buyer."
    },
    si: {
      title: "ප්‍රතිලාභ සහ හුවමාරු ප්‍රතිපත්තිය",
      p1: "Rudraksha Lanka වෙතින් නිකුත් කරන සියලුම භාණ්ඩ 100%ක්ම ස්වභාවික සහ පරිශුද්ධ ඒවා වේ. භාණ්ඩයක් මිලදී ගැනීමෙන් පසු සිත වෙනස්වීම් මත (Change of mind) හෝ පුද්ගලික රුචිකත්වයන් මත භාණ්ඩ නැවත භාරගනු හෝ මාරු කරනු නොලැබේ. හුවමාරු කිරීම් සිදු කරනු ලබන්නේ පහත දැඩි කොන්දේසි මත පමණි:",
      eligibility: "හුවමාරු කළ හැකි අවස්ථා",
      eligibilityText: "ඔබට ලැබුණු භාණ්ඩයේ කිසියම් නිෂ්පාදන දෝෂයක් (Manufacturing Defect) පවතී නම් හෝ අප අතින් වෙනත් වැරදි භාණ්ඩයක් එවා තිබේ නම් පමණක් භාණ්ඩය මාරු කරගත හැක.",
      noMindChange: "සිත වෙනස්වීම් නොසලකයි",
      noMindChangeText: "පුද්ගලික රුචිකත්වයන් හෝ වෙනත් හේතූන් මත භාණ්ඩය මාරු කිරීමක් සිදු නොකරයි.",
      timeframe: "කාලසීමාව",
      timeframeText: "භාණ්ඩය ඔබට ලැබී දින 14ක් ඇතුළත පමණක් මේ පිළිබඳව අපව දැනුවත් කළ යුතුය. දින 14 ඉක්මවූ පසු කිසිදු හුවමාරුවක් සිදු කරනු නොලැබේ.",
      condition: "තත්ත්වය",
      conditionText: "හුවමාරු කරන භාණ්ඩය කිසිසේත් පාවිච්චි නොකළ, හානි නොකළ සහ මුල් ඇසුරුම (Original Packaging) සහිතව තිබීම අනිවාර්ය වේ.",
      logistics: "ප්‍රවාහනය",
      logisticsText: "අපගේ දෝෂයක් නම් ප්‍රවාහන ගාස්තු අප විසින් දරනු ලැබේ. වෙනත් අවස්ථාවලදී ප්‍රවාහන ගාස්තු ගැනුම්කරු විසින් දැරිය යුතුය."
    },
    ta: {
      title: "திரும்பப் பெறுதல் மற்றும் பரிமாற்றக் கொள்கை",
      p1: "வாடிக்கையாளர் தனது மனதை மாற்றிக்கொண்டதற்காக அல்லது தனிப்பட்ட விருப்பமின்மைக்காக பொருட்கள் எக்காரணம் கொண்டும் திரும்பப் பெறப்படமாட்டாது. பரிமாற்றங்கள் (Exchanges) பின்வரும் நிபந்தனைகளுக்கு மட்டுமே உட்பட்டது:",
      eligibility: "தகுதி",
      eligibilityText: "உங்களுக்கு வழங்கப்பட்ட தயாரிப்பில் தயாரிப்புக் குறைபாடு (Manufacturing Defect) இருந்தால் அல்லது தவறான தயாரிப்பு அனுப்பப்பட்டிருந்தால் மட்டுமே மாற்றிக்கொள்ள முடியும்.",
      noMindChange: "மனம் மாற்றுதல் இல்லை",
      noMindChangeText: "வாடிக்கையாளரின் மனம் மாறுதல் காரணமாக பரிமாற்றங்கள் நிராகரிக்கப்படும்.",
      timeframe: "காலக்கெடு",
      timeframeText: "தயாரிப்பு விநியோகிக்கப்பட்ட 14 நாட்களுக்குள் மட்டுமே நீங்கள் எங்களை தொடர்பு கொள்ள வேண்டும். 14 நாட்களுக்குப் பிறகு வரும் கோரிக்கைகள் நிராகரிக்கப்படும்.",
      condition: "நிலைமை",
      conditionText: "மாற்றப்பட வேண்டிய பொருள் பயன்படுத்தப்படாததாகவும், அதன் அசல் பேக்கேஜிங்குடன் (Original Packaging) இருக்க வேண்டும்.",
      logistics: "தளவாடங்கள்",
      logisticsText: "உறுதிப்படுத்தப்பட்ட பிழைகளுக்கான விநியோகக் கட்டணங்களை நாங்கள் ஏற்றுக்கொள்வோம். பிற அங்கீகரிக்கப்பட்ட சந்தர்ப்பங்களில் வாங்குபவரே கப்பல் கட்டணத்தை செலுத்த வேண்டும்."
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
          
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li style={{ marginBottom: '1.2rem', color: '#eaeaea', fontSize: '1.05rem', textAlign: 'justify' }}>
              <strong style={{ color: 'var(--color-gold)', display: 'block', marginBottom: '0.2rem' }}>{current.eligibility}</strong>
              {current.eligibilityText}
            </li>
            <li style={{ marginBottom: '1.2rem', color: '#eaeaea', fontSize: '1.05rem', textAlign: 'justify' }}>
              <strong style={{ color: 'var(--color-gold)', display: 'block', marginBottom: '0.2rem' }}>{current.noMindChange}</strong>
              {current.noMindChangeText}
            </li>
            <li style={{ marginBottom: '1.2rem', color: '#eaeaea', fontSize: '1.05rem', textAlign: 'justify' }}>
              <strong style={{ color: 'var(--color-gold)', display: 'block', marginBottom: '0.2rem' }}>{current.timeframe}</strong>
              {current.timeframeText}
            </li>
            <li style={{ marginBottom: '1.2rem', color: '#eaeaea', fontSize: '1.05rem', textAlign: 'justify' }}>
              <strong style={{ color: 'var(--color-gold)', display: 'block', marginBottom: '0.2rem' }}>{current.condition}</strong>
              {current.conditionText}
            </li>
            <li style={{ color: '#eaeaea', fontSize: '1.05rem', textAlign: 'justify' }}>
              <strong style={{ color: 'var(--color-gold)', display: 'block', marginBottom: '0.2rem' }}>{current.logistics}</strong>
              {current.logisticsText}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
