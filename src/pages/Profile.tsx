
import { useState } from 'react';
import { User, Mail, Phone, Shield, Car, Edit2, Save } from 'lucide-react';
import Header from '@/components/Header';
import Button from '@/components/Button';
import PhotoCapture from '@/components/PhotoCapture';

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licensePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  insuranceCompany: string;
  insuranceNumber: string;
}

const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licensePlate: '',
    vehicleBrand: '',
    vehicleModel: '',
    insuranceCompany: '',
    insuranceNumber: '',
  });
  
  const [activeTab, setActiveTab] = useState('personal');
  const [editMode, setEditMode] = useState(true);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePhotoCapture = (file: File) => {
    setProfilePicture(file);
    setProfilePictureUrl(URL.createObjectURL(file));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile data submitted:', profileData);
    setEditMode(false);
  };
  
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };
  
  return (
    <div className="min-h-screen bg-constalib-light-gray/30">
      <Header />
      
      <main className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-constalib-dark mb-8">Mon Profil</h1>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Profile header */}
            <div className="bg-gradient-to-r from-constalib-blue/10 to-constalib-light-blue p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                {profilePictureUrl ? (
                  <img 
                    src={profilePictureUrl} 
                    alt="Profile" 
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white"
                  />
                ) : (
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-constalib-light-blue flex items-center justify-center border-4 border-white">
                    <User className="w-12 h-12 md:w-16 md:h-16 text-constalib-blue/40" />
                  </div>
                )}
                
                {editMode && (
                  <div className="absolute bottom-0 right-0">
                    <PhotoCapture 
                      onPhotoCapture={handlePhotoCapture} 
                      label=""
                    />
                  </div>
                )}
              </div>
              
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-semibold text-constalib-dark">
                  {profileData.firstName || profileData.lastName 
                    ? `${profileData.firstName} ${profileData.lastName}` 
                    : 'Nouveau Profil'}
                </h2>
                {(profileData.email || profileData.phone) && (
                  <div className="mt-2 text-constalib-dark-gray space-y-1">
                    {profileData.email && (
                      <div className="flex items-center justify-center md:justify-start">
                        <Mail className="w-4 h-4 mr-2" />
                        <span>{profileData.email}</span>
                      </div>
                    )}
                    {profileData.phone && (
                      <div className="flex items-center justify-center md:justify-start">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{profileData.phone}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="ml-auto">
                <Button
                  variant="ghost"
                  onClick={toggleEditMode}
                  className="flex items-center"
                >
                  {editMode ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Terminer
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Modifier
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="border-b border-constalib-light-gray">
              <div className="flex">
                <button
                  className={`px-6 py-4 font-medium text-sm transition-colors ${
                    activeTab === 'personal'
                      ? 'text-constalib-blue border-b-2 border-constalib-blue'
                      : 'text-constalib-dark-gray hover:text-constalib-dark'
                  }`}
                  onClick={() => setActiveTab('personal')}
                >
                  Informations personnelles
                </button>
                <button
                  className={`px-6 py-4 font-medium text-sm transition-colors ${
                    activeTab === 'vehicle'
                      ? 'text-constalib-blue border-b-2 border-constalib-blue'
                      : 'text-constalib-dark-gray hover:text-constalib-dark'
                  }`}
                  onClick={() => setActiveTab('vehicle')}
                >
                  Véhicule & Assurance
                </button>
              </div>
            </div>
            
            {/* Tab content */}
            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit}>
                {activeTab === 'personal' ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-constalib-dark mb-2">
                          Prénom
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue disabled:bg-constalib-light-gray/50 disabled:cursor-not-allowed"
                          placeholder="Votre prénom"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-constalib-dark mb-2">
                          Nom
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue disabled:bg-constalib-light-gray/50 disabled:cursor-not-allowed"
                          placeholder="Votre nom"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-constalib-dark mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue disabled:bg-constalib-light-gray/50 disabled:cursor-not-allowed"
                        placeholder="votre.email@exemple.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-constalib-dark mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue disabled:bg-constalib-light-gray/50 disabled:cursor-not-allowed"
                        placeholder="06 12 34 56 78"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-constalib-light-blue flex items-center justify-center mr-4">
                        <Car className="w-5 h-5 text-constalib-blue" />
                      </div>
                      <h3 className="text-lg font-medium text-constalib-dark">Informations du véhicule</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label htmlFor="licensePlate" className="block text-sm font-medium text-constalib-dark mb-2">
                          Immatriculation
                        </label>
                        <input
                          type="text"
                          id="licensePlate"
                          name="licensePlate"
                          value={profileData.licensePlate}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue disabled:bg-constalib-light-gray/50 disabled:cursor-not-allowed"
                          placeholder="AB-123-CD"
                        />
                      </div>
                      <div>
                        <label htmlFor="vehicleBrand" className="block text-sm font-medium text-constalib-dark mb-2">
                          Marque
                        </label>
                        <input
                          type="text"
                          id="vehicleBrand"
                          name="vehicleBrand"
                          value={profileData.vehicleBrand}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue disabled:bg-constalib-light-gray/50 disabled:cursor-not-allowed"
                          placeholder="Renault, Peugeot, etc."
                        />
                      </div>
                      <div>
                        <label htmlFor="vehicleModel" className="block text-sm font-medium text-constalib-dark mb-2">
                          Modèle
                        </label>
                        <input
                          type="text"
                          id="vehicleModel"
                          name="vehicleModel"
                          value={profileData.vehicleModel}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue disabled:bg-constalib-light-gray/50 disabled:cursor-not-allowed"
                          placeholder="Clio, 308, etc."
                        />
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-constalib-light-blue flex items-center justify-center mr-4">
                          <Shield className="w-5 h-5 text-constalib-blue" />
                        </div>
                        <h3 className="text-lg font-medium text-constalib-dark">Informations d'assurance</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                          <label htmlFor="insuranceCompany" className="block text-sm font-medium text-constalib-dark mb-2">
                            Compagnie d'assurance
                          </label>
                          <input
                            type="text"
                            id="insuranceCompany"
                            name="insuranceCompany"
                            value={profileData.insuranceCompany}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue disabled:bg-constalib-light-gray/50 disabled:cursor-not-allowed"
                            placeholder="Nom de votre assureur"
                          />
                        </div>
                        <div>
                          <label htmlFor="insuranceNumber" className="block text-sm font-medium text-constalib-dark mb-2">
                            Numéro de contrat
                          </label>
                          <input
                            type="text"
                            id="insuranceNumber"
                            name="insuranceNumber"
                            value={profileData.insuranceNumber}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue disabled:bg-constalib-light-gray/50 disabled:cursor-not-allowed"
                            placeholder="Numéro de votre contrat"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {editMode && (
                  <div className="mt-8 flex justify-end">
                    <Button type="submit">
                      Enregistrer
                    </Button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
