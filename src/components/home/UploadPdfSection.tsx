import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { downloadPDF } from '@/utils/downloadUtils';

const UploadPdfSection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setUploadError(null);
      } else {
        setFile(null);
        setUploadError('Veuillez sélectionner un fichier PDF');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadSuccess(false);
    setUploadError(null);

    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a temporary URL for the uploaded file
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      
      setUploadSuccess(true);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Une erreur est survenue lors du téléchargement');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async () => {
    if (pdfUrl) {
      await downloadPDF(pdfUrl, file?.name || 'document.pdf');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Télécharger un constat existant</CardTitle>
        <CardDescription>
          Importez un constat amiable PDF pour le consulter ou le modifier
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="pdf-upload">Fichier PDF</Label>
            <Input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
          </div>

          {uploadError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

          {uploadSuccess && (
            <Alert variant="success" className="bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Fichier téléchargé avec succès
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleUpload}
          disabled={!file || uploading}
          className="flex items-center"
        >
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? 'Téléchargement...' : 'Télécharger'}
        </Button>

        {uploadSuccess && (
          <Button
            variant="default"
            onClick={handleDownload}
            className="flex items-center"
          >
            <FileText className="mr-2 h-4 w-4" />
            Télécharger le PDF
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default UploadPdfSection;
