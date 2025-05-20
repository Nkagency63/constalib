
// Fix onSubmitSuccess and error handling in handleGenerateReport
const handleGenerateReport = async () => {
  setIsSubmitting(true);
  try {
    await registerReport(formData);
    toast.success("Votre constat a été enregistré avec succès!");
    if (onSubmitSuccess) {
      onSubmitSuccess();
    }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du constat:', error);
    const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'enregistrement du constat";
    toast.error(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};
