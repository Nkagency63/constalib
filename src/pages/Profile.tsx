
import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Car, Shield, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Profile = () => {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressStreet: '',
    addressCity: '',
    addressPostalCode: '',
    addressCountry: 'France'
  });

  const [vehicleData, setVehicleData] = useState({
    licensePlate: '',
    brand: '',
    model: '',
    year: '',
    insuranceCompany: '',
    policyNumber: ''
  });

  useEffect(() => {
    if (profile) {
      setProfileData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        addressStreet: profile.address_street || '',
        addressCity: profile.address_city || '',
        addressPostalCode: profile.address_postal_code || '',
        addressCountry: profile.address_country || 'France'
      });
    }
  }, [profile, user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVehicleData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile({
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        address_street: profileData.addressStreet,
        address_city: profileData.addressCity,
        address_postal_code: profileData.addressPostalCode,
        address_country: profileData.addressCountry
      });

      toast({
        title: "Profil mis à jour",
        description: "Vos informations personnelles ont été mises à jour avec succès.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-constalib-light-gray/30">
      <Header />
      
      <main className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-constalib-dark mb-2">Mon Profil</h1>
            <p className="text-constalib-dark-gray">
              Gérez vos informations personnelles et vos véhicules
            </p>
          </div>

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
              <TabsTrigger value="address">Adresse</TabsTrigger>
              <TabsTrigger value="vehicle">Véhicule & Assurance</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informations personnelles
                  </CardTitle>
                  <CardDescription>
                    Mettez à jour vos informations de contact
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-constalib-dark mb-2">
                          Prénom
                        </label>
                        <Input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleProfileChange}
                          placeholder="Votre prénom"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-constalib-dark mb-2">
                          Nom
                        </label>
                        <Input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleProfileChange}
                          placeholder="Votre nom"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-constalib-dark mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-constalib-gray" />
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          className="pl-11"
                          placeholder="votre.email@exemple.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-constalib-dark mb-2">
                        Téléphone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-constalib-gray" />
                        <Input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                          className="pl-11"
                          placeholder="06 12 34 56 78"
                        />
                      </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? 'Mise à jour...' : 'Sauvegarder'}
                      <Save className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="address">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Adresse
                  </CardTitle>
                  <CardDescription>
                    Votre adresse de résidence
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="addressStreet" className="block text-sm font-medium text-constalib-dark mb-2">
                        Adresse
                      </label>
                      <Input
                        type="text"
                        id="addressStreet"
                        name="addressStreet"
                        value={profileData.addressStreet}
                        onChange={handleProfileChange}
                        placeholder="123 Rue de la Paix"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="addressPostalCode" className="block text-sm font-medium text-constalib-dark mb-2">
                          Code postal
                        </label>
                        <Input
                          type="text"
                          id="addressPostalCode"
                          name="addressPostalCode"
                          value={profileData.addressPostalCode}
                          onChange={handleProfileChange}
                          placeholder="75001"
                        />
                      </div>
                      <div>
                        <label htmlFor="addressCity" className="block text-sm font-medium text-constalib-dark mb-2">
                          Ville
                        </label>
                        <Input
                          type="text"
                          id="addressCity"
                          name="addressCity"
                          value={profileData.addressCity}
                          onChange={handleProfileChange}
                          placeholder="Paris"
                        />
                      </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? 'Mise à jour...' : 'Sauvegarder'}
                      <Save className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vehicle">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    Véhicule & Assurance
                  </CardTitle>
                  <CardDescription>
                    Informations sur votre véhicule et votre assurance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="licensePlate" className="block text-sm font-medium text-constalib-dark mb-2">
                          Plaque d'immatriculation
                        </label>
                        <Input
                          type="text"
                          id="licensePlate"
                          name="licensePlate"
                          value={vehicleData.licensePlate}
                          onChange={handleVehicleChange}
                          placeholder="AB-123-CD"
                        />
                      </div>
                      <div>
                        <label htmlFor="brand" className="block text-sm font-medium text-constalib-dark mb-2">
                          Marque
                        </label>
                        <Input
                          type="text"
                          id="brand"
                          name="brand"
                          value={vehicleData.brand}
                          onChange={handleVehicleChange}
                          placeholder="Peugeot"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="model" className="block text-sm font-medium text-constalib-dark mb-2">
                          Modèle
                        </label>
                        <Input
                          type="text"
                          id="model"
                          name="model"
                          value={vehicleData.model}
                          onChange={handleVehicleChange}
                          placeholder="308"
                        />
                      </div>
                      <div>
                        <label htmlFor="year" className="block text-sm font-medium text-constalib-dark mb-2">
                          Année
                        </label>
                        <Input
                          type="text"
                          id="year"
                          name="year"
                          value={vehicleData.year}
                          onChange={handleVehicleChange}
                          placeholder="2020"
                        />
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-constalib-dark mb-4">
                        <Shield className="w-5 h-5" />
                        Assurance
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="insuranceCompany" className="block text-sm font-medium text-constalib-dark mb-2">
                            Compagnie d'assurance
                          </label>
                          <Input
                            type="text"
                            id="insuranceCompany"
                            name="insuranceCompany"
                            value={vehicleData.insuranceCompany}
                            onChange={handleVehicleChange}
                            placeholder="AXA"
                          />
                        </div>
                        <div>
                          <label htmlFor="policyNumber" className="block text-sm font-medium text-constalib-dark mb-2">
                            Numéro de police
                          </label>
                          <Input
                            type="text"
                            id="policyNumber"
                            name="policyNumber"
                            value={vehicleData.policyNumber}
                            onChange={handleVehicleChange}
                            placeholder="123456789"
                          />
                        </div>
                      </div>
                    </div>

                    <Button type="button" className="w-full">
                      Sauvegarder les informations véhicule
                      <Save className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
