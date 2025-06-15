import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const ContactForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [prospectEmail, setProspectEmail] = useState('');
  const [company, setCompany] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [onContactSaved, setOnContactSaved] = useState<() => void | undefined>(() => {});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      
      console.log('Submitting contact form:', { email, phone, prospectEmail });
      
      // Use the server-side API endpoint to bypass RLS
      const response = await fetch('/api/prospects/create-or-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: prospectEmail,
          phone,
          company_name: company?.name || 'Unknown Company',
          workflow_stage: 'needs_transcript',
          primary_contact_email: email,
          primary_contact_phone: phone,
          quickbooks_company_id: company?.id
        }),
      });

      const result = await response.json();
      console.log('Contact save response:', result);

      if (!response.ok) {
        console.error('Contact save failed:', result);
        throw new Error(result.error || 'Failed to save contact information');
      }

      toast.success('Contact information saved successfully!');
      
      // If we have a callback, execute it
      if (onContactSaved) {
        onContactSaved();
      }
      
      // Refresh the page with updated params to show the new data
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('updated', Date.now().toString());
      window.location.href = currentUrl.toString();
      
    } catch (error) {
      console.error('Contact form error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save contact information';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Render your form components here */}
    </div>
  );
};

export default ContactForm;