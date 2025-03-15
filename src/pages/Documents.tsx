
import Header from '@/components/Header';
import { FileText, FilePlus, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";

const Documents = () => {
  return (
    <div className="min-h-screen bg-constalib-light-gray/30">
      <Header />
      
      <main className="container mx-auto px-4 py-20 md:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-constalib-dark mb-2">Mes Documents</h1>
          <p className="text-sm md:text-base text-constalib-dark-gray mb-6 md:mb-8">
            Consultez et gérez vos documents liés à vos déclarations d'accident sur Constalib.fr.
          </p>
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">Tous</TabsTrigger>
                  <TabsTrigger value="declarations">Déclarations</TabsTrigger>
                  <TabsTrigger value="insurance">Assurance</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <Button className="flex items-center gap-2">
              <FilePlus className="h-4 w-4" />
              Ajouter un document
            </Button>
          </div>
          
          {/* Empty state or placeholder for document list */}
          <div className="mt-8 text-center p-12 bg-white rounded-lg border border-constalib-light-gray">
            <div className="mx-auto w-12 h-12 rounded-full bg-constalib-light-blue/30 flex items-center justify-center mb-4">
              <FolderOpen className="h-6 w-6 text-constalib-blue" />
            </div>
            <h3 className="text-xl font-semibold text-constalib-dark mb-2">Aucun document</h3>
            <p className="text-constalib-dark-gray mb-6">
              Vous n'avez pas encore de documents dans votre espace personnel.
            </p>
            <Button variant="outline" className="flex items-center gap-2 mx-auto">
              <FileText className="h-4 w-4" />
              Déclarer un accident
            </Button>
          </div>
        </div>
      </main>

      <Toaster />
    </div>
  );
};

export default Documents;
