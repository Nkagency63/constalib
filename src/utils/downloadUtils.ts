
// Fonction pour télécharger un PDF à partir d'une URL
export const downloadPDF = async (pdfUrl: string, filename: string = 'document.pdf') => {
  try {
    // Vérifier que l'URL est valide
    if (!pdfUrl) {
      throw new Error('URL de PDF invalide');
    }
    
    // Récupérer le contenu du PDF
    const response = await fetch(pdfUrl);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    // Convertir le contenu en blob
    const blob = await response.blob();
    
    // Créer un objet URL pour le blob
    const url = window.URL.createObjectURL(blob);
    
    // Créer un élément d'ancrage temporaire pour le téléchargement
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Ajouter l'ancre au document, cliquer dessus, puis la supprimer
    document.body.appendChild(link);
    link.click();
    
    // Nettoyage
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }, 100);
    
    return true;
  } catch (error: any) {
    console.error('Erreur lors du téléchargement du PDF:', error);
    throw new Error(`Erreur lors du téléchargement: ${error.message}`);
  }
};
