export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1rem', color: 'var(--color-off-white)' }}>
      <h1 style={{ color: 'var(--color-gold)', marginBottom: '2rem' }}>Privacy Policy</h1>
      <p style={{ marginBottom: '1rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2 style={{ color: 'var(--color-gold)', marginTop: '2rem', marginBottom: '1rem' }}>1. Information We Collect</h2>
      <p style={{ marginBottom: '1rem' }}>
        When you place an order on Rudraksha Lanka, we collect personal information such as your name, email address, phone number, and delivery address. This information is strictly used to process and deliver your orders.
      </p>

      <h2 style={{ color: 'var(--color-gold)', marginTop: '2rem', marginBottom: '1rem' }}>2. How We Use Your Information</h2>
      <p style={{ marginBottom: '1rem' }}>
        The information we collect is used in the following ways:
      </p>
      <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginBottom: '1rem' }}>
        <li>To process transactions and deliver your purchased products.</li>
        <li>To send periodic emails regarding your order or other products and services.</li>
        <li>To improve our website and customer service based on your feedback.</li>
      </ul>

      <h2 style={{ color: 'var(--color-gold)', marginTop: '2rem', marginBottom: '1rem' }}>3. Data Protection</h2>
      <p style={{ marginBottom: '1rem' }}>
        We implement a variety of security measures to maintain the safety of your personal information. We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information.
      </p>

      <h2 style={{ color: 'var(--color-gold)', marginTop: '2rem', marginBottom: '1rem' }}>4. Cookies</h2>
      <p style={{ marginBottom: '1rem' }}>
        We use cookies to understand and save your preferences for future visits, enabling a smoother and more personalized shopping experience.
      </p>

      <h2 style={{ color: 'var(--color-gold)', marginTop: '2rem', marginBottom: '1rem' }}>5. Contact Us</h2>
      <p style={{ marginBottom: '1rem' }}>
        If there are any questions regarding this privacy policy, you may contact us using the information on our website.
      </p>
    </div>
  );
}
