import React, { useState, useEffect, createContext, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, query } from 'firebase/firestore';

// --- Translations Object ---
const translations = {
    en: {
        appName: "Kohinoor Lights",
        home: "Home",
        services: "Services",
        products: "Products",
        book: "Book",
        myBookings: "My Bookings",
        contactNav: "Contact",
        search: "Search...",
        userId: "User ID:",
        loadingApp: "Loading Application...",
        welcomeTitle: "Enhance Your Car's Vision",
        welcomeSubtitle: "One-stop solution for excellent headlights and services.",
        ourServices: "Our Services",
        featuredProducts: "Featured Products",
        view: "View",
        bookAppointment: "Book Appointment",
        contactUs: "Contact Us",
        headlightRestoration: "Headlight Restoration",
        headlightReplacement: "Headlight Replacement",
        fogLightInstallation: "Fog Light Installation",
        mirrorReplacement: "Mirror Replacement",
        newArrivals: "New Arrivals",
        usedParts: "Used Parts",
        specialistBrands: "Specialist Brands",
        headlightRestorationDesc: "Restore dull headlights to their original clarity and brightness.",
        headlightReplacementDesc: "Install new headlights to improve visibility and aesthetics.",
        fogLightInstallationDesc: "Enhance visibility in foggy conditions with powerful fog lights.",
        mirrorReplacementDesc: "Replace broken or damaged mirrors with quality parts.",
        newArrivalsDesc: "Explore the latest and trendiest lighting collections.",
        usedPartsDesc: "Affordable, good quality used parts.",
        specialistBrandsDesc: "Expertise in Maruti, Honda, Tata, Hyundai, Toyota & more.",
        allOurServices: "All Our Services",
        learnMore: "Learn More",
        serviceDetail: "Service Details",
        benefits: "Benefits",
        estimatedTime: "Estimated Time:",
        productsTitle: "Our Products",
        productDetail: "Product Details",
        price: "Price:",
        specifications: "Specifications:",
        compatibility: "Compatibility:",
        generateNewImage: "Generate New Image",
        generatingImage: "Generating Image...",
        generatedImage: "Generated Image:",
        imageCouldNotBeGenerated: "Image could not be generated. Please try again.",
        failedToGenerateImage: "Failed to generate image:",
        aiProductInsights: "✨ AI Product Insights ✨",
        generatingInsights: "Generating insights...",
        productInsights: "Product Insights:",
        failedToGenerateInsights: "Failed to generate insights.",
        selectServiceType: "Select Service Type:",
        selectService: "Select Service",
        vehicleMake: "Vehicle Make (e.g. Maruti, Honda):",
        vehicleModel: "Vehicle Model (e.g. Swift, City):",
        appointmentDate: "Appointment Date:",
        appointmentTime: "Appointment Time:",
        yourName: "Your Name:",
        yourPhoneNumber: "Your Phone Number:",
        requiredFields: "Please fill in all required fields.",
        bookingSuccess: "Your appointment has been successfully booked. We will contact you soon.",
        bookingFailed: "Error booking appointment:",
        tryAgain: "Please try again.",
        bookingAppointment: "Booking Appointment...",
        confirmDeletion: "Confirm Deletion",
        areYouSureToDelete: "Are you sure you want to delete the appointment for",
        yesDelete: "Yes, Delete",
        noCancel: "No, Cancel",
        noAppointments: "You have no appointments.",
        bookOneNow: "Book one now!",
        vehicle: "Vehicle:",
        date: "Date:",
        time: "Time:",
        contactPerson: "Contact:",
        reschedule: "Reschedule",
        cancel: "Cancel",
        errorFetchingAppointments: "Error fetching appointments.",
        myAppointments: "My Appointments",
        aboutUs: "About Us",
        owner: "Owner:",
        aboutKohinoor: "About Kohinoor Lights",
        mission: "Our Mission",
        missionText: "To provide the best car lighting solutions and services, ensuring safety and style for our customers.",
        faqs: "Frequently Asked Questions",
        faq1Q: "What services do you offer?",
        faq1A: "We offer headlight restoration, replacement, fog light installation, mirror replacement, and custom lighting solutions.",
        faq2Q: "Which car brands do you specialize in?",
        faq2A: "We specialize in Maruti, Tata, Honda, Hyundai, Innova, Opel, Ford, Santro, Toyota, and more.",
        testimonials: "Customer Testimonials",
        testi1: "Excellent service! My car's headlights look brand new.",
        testi2: "Very professional and quick. Highly recommend Kohinoor Lights!",
        testi3: "Great selection of products and expert installation.",
        ourAddress: "Our Address",
        viewOnMap: "View on Map",
        phoneNumbers: "Phone Numbers",
        email: "Email",
        workingHours: "Working Hours",
        followUs: "Follow Us",
        mondayToSaturday: "Monday - Saturday: 9:00 AM - 7:00 PM",
        sunday: "Sunday: Closed",
        aiChat: "AI Chat",
        askAboutLights: "Ask anything about car lights or our services...",
        sendMessage: "Send Message",
        aiThinking: "AI is thinking...",
        aiChatIntro: "Hello! I am the AI Assistant for your Kohinoor Lights app. You can ask me anything about car lights or our services.",
        personalizedServiceSuggestion: "✨ Personalized Service Suggestion ✨",
        describeYourIssue: "Describe your car's issue or needs:",
        suggestServices: "Suggest Services",
        aiServiceSuggestion: "AI Service Suggestion:",
        noSuggestionFound: "No suggestion found. Please try again.",
        generatingSuggestion: "Generating suggestion...",
        appNotReady: "App is not ready. Please try again in a moment.",
        errorDeletingAppointment: "Error deleting appointment.",
        loadingAppointments: "Loading appointments..."
    },
    hi: {
        appName: "कोहिनूर लाइट्स",
        home: "होम",
        services: "सेवाएं",
        products: "उत्पाद",
        book: "बुक करें",
        myBookings: "मेरी बुकिंग्स",
        contactNav: "संपर्क करें",
        search: "खोजें...",
        userId: "यूज़र आईडी:",
        loadingApp: "एप्लिकेशन लोड हो रहा है...",
        welcomeTitle: "अपनी कार की रोशनी बढ़ाएं",
        welcomeSubtitle: "बेहतरीन हेडलाइट्स और सेवाओं के लिए वन-स्टॉप समाधान।",
        ourServices: "हमारी सेवाएं",
        featuredProducts: "खास प्रोडक्ट्स",
        view: "देखें",
        bookAppointment: "अपॉइंटमेंट बुक करें",
        contactUs: "हमसे संपर्क करें",
        headlightRestoration: "हेडलाइट रेस्टोरेशन",
        headlightReplacement: "हेडलाइट रिप्लेसमेंट",
        fogLightInstallation: "फॉग लाइट इंस्टॉलेशन",
        mirrorReplacement: "मिरर रिप्लेसमेंट",
        newArrivals: "नए आगमन",
        usedParts: "पुराने पार्ट्स",
        specialistBrands: "विशेषज्ञ ब्रांड्स",
        headlightRestorationDesc: "पुरानी हेडलाइट्स को उनकी मूल स्पष्टता और चमक में बहाल करें।",
        headlightReplacementDesc: "दृश्यता और सौंदर्यशास्त्र में सुधार के लिए नई हेडलाइट्स स्थापित करें।",
        fogLightInstallationDesc: "शक्तिशाली फॉग लाइट्स के साथ कोहरे की स्थिति में दृश्यता बढ़ाएं।",
        mirrorReplacementDesc: "टूटे या क्षतिग्रस्त मिरर्स को गुणवत्ता वाले पुर्जों से बदलें।",
        newArrivalsDesc: "नवीनतम और सबसे ट्रेंडिएस्ट लाइटिंग कलेक्शन का अन्वेषण करें।",
        usedPartsDesc: "किफायती, अच्छी गुणवत्ता वाले पुराने पुर्जे।",
        specialistBrandsDesc: "मारुति, होंडा, टाटा, हुंडई, टोयोटा और अन्य में विशेषज्ञता।",
        allOurServices: "हमारी सभी सेवाएं",
        learnMore: "और जानें",
        serviceDetail: "सेवा विवरण",
        benefits: "लाभ",
        estimatedTime: "अनुमानित समय:",
        productsTitle: "हमारे उत्पाद",
        productDetail: "उत्पाद विवरण",
        price: "मूल्य:",
        specifications: "विशेष विवरण:",
        compatibility: "संगतता:",
        generateNewImage: "नई इमेज जनरेट करें",
        generatingImage: "इमेज जनरेट हो रही है...",
        generatedImage: "जनरेटेड इमेज:",
        imageCouldNotBeGenerated: "इमेज जनरेट नहीं की जा सकी। कृपया पुनः प्रयास करें।",
        failedToGenerateImage: "इमेज जनरेट करने में विफल:",
        aiProductInsights: "✨ एआई उत्पाद अंतर्दृष्टि ✨",
        generatingInsights: "अंतर्दृष्टि जनरेट हो रही है...",
        productInsights: "उत्पाद अंतर्दृष्टि:",
        failedToGenerateInsights: "अंतर्दृष्टि जनरेट करने में विफल।",
        selectServiceType: "सेवा का प्रकार चुनें:",
        selectService: "सेवा चुनें",
        vehicleMake: "वाहन का ब्रांड (उदाहरण: Maruti, Honda):",
        vehicleModel: "वाहन का मॉडल (उदाहरण: Swift, City):",
        appointmentDate: "अपॉइंटमेंट की तारीख:",
        appointmentTime: "अपॉइंटमेंट का समय:",
        yourName: "आपका नाम:",
        yourPhoneNumber: "आपका फ़ोन नंबर:",
        requiredFields: "कृपया सभी आवश्यक फ़ील्ड भरें।",
        bookingSuccess: "आपकी अपॉइंटमेंट सफलतापूर्वक बुक हो गई है। हम जल्द ही आपसे संपर्क करेंगे।",
        bookingFailed: "अपॉइंटमेंट बुक करने में त्रुटि हुई:",
        tryAgain: "कृपया पुनः प्रयास करें।",
        bookingAppointment: "अपॉइंटमेंट बुक कर रहा है...",
        confirmDeletion: "डिलीशन की पुष्टि करें",
        areYouSureToDelete: "क्या आप वाकई के लिए अपॉइंटमेंट हटाना चाहते हैं?",
        yesDelete: "हां, हटा दें",
        noCancel: "नहीं, रद्द करें",
        noAppointments: "आपके पास कोई अपॉइंटमेंट नहीं है।",
        bookOneNow: "अभी एक बुक करें!",
        vehicle: "वाहन:",
        date: "तारीख:",
        time: "समय:",
        contactPerson: "संपर्क:",
        reschedule: "री-शेड्यूल करें",
        cancel: "कैंसिल करें",
        errorFetchingAppointments: "अपॉइंटमेंट लाने में त्रुटि हुई।",
        myAppointments: "मेरी अपॉइंटमेंट्स",
        aboutUs: "हमारे बारे में",
        owner: "मालिक:",
        aboutKohinoor: "कोहिनूर लाइट्स के बारे में",
        mission: "हमारा मिशन",
        missionText: "हमारे ग्राहकों के लिए सुरक्षा और स्टाइल सुनिश्चित करते हुए, सर्वोत्तम कार लाइटिंग समाधान और सेवाएं प्रदान करना।",
        faqs: "अक्सर पूछे जाने वाले प्रश्न",
        faq1Q: "आप कौन सी सेवाएं प्रदान करते हैं?",
        faq1A: "हम हेडलाइट रेस्टोरेशन, रिप्लेसमेंट, फॉग लाइट इंस्टॉलेशन, मिरर रिप्लेसमेंट और कस्टम लाइटिंग समाधान प्रदान करते हैं।",
        faq2Q: "आप किन कार ब्रांडों में विशेषज्ञ हैं?",
        faq2A: "हम मारुति, टाटा, होंडा, हुंडई, इनोवा, ओपल, फोर्ड, सैंट्रो, टोयोटा और अन्य में विशेषज्ञ हैं।",
        testimonials: "ग्राहक प्रशंसापत्र",
        testi1: "उत्कृष्ट सेवा! मेरी कार की हेडलाइट्स बिल्कुल नई जैसी दिखती हैं।",
        testi2: "बहुत पेशेवर और तेज़। कोहिनूर लाइट्स की अत्यधिक अनुशंसा करता हूँ!",
        testi3: "उत्पादों का शानदार चयन और विशेषज्ञ स्थापना।",
        ourAddress: "हमारा पता",
        viewOnMap: "मैप पर देखें",
        phoneNumbers: "फोन नंबर",
        email: "ईमेल",
        workingHours: "कार्य समय",
        followUs: "हमें फॉलो करें",
        mondayToSaturday: "सोमवार - शनिवार: सुबह 9:00 बजे - शाम 7:00 बजे",
        sunday: "रविवार: बंद",
        aiChat: "एआई चैट",
        askAboutLights: "कार की लाइटों या हमारी सेवाओं के बारे में कुछ भी पूछें...",
        sendMessage: "संदेश भेजें",
        aiThinking: "एआई सोच रहा है...",
        aiChatIntro: "नमस्ते! मैं आपके Kohinoor Lights ऐप का AI असिस्टेंट हूँ। आप मुझसे कार लाइट्स या हमारी सेवाओं के बारे में कुछ भी पूछ सकते हैं।",
        personalizedServiceSuggestion: "✨ व्यक्तिगत सेवा सुझाव ✨",
        describeYourIssue: "अपनी कार की समस्या या ज़रूरतें बताएं:",
        suggestServices: "सेवाएं सुझाएं",
        aiServiceSuggestion: "एआई सेवा सुझाव:",
        noSuggestionFound: "कोई सुझाव नहीं मिला। कृपया पुनः प्रयास करें।",
        generatingSuggestion: "सुझाव जनरेट हो रहा है...",
        appNotReady: "ऐप तैयार नहीं है। कृपया थोड़ी देर में पुनः प्रयास करें।",
        errorDeletingAppointment: "अपॉइंटमेंट हटाने में त्रुटि हुई।",
        loadingAppointments: "अपॉइंटमेंट लोड हो रहे हैं..."
    },
    mr: {
        appName: "कोहिनूर लाइट्स",
        home: "मुख्यपृष्ठ",
        services: "सेवा",
        products: "उत्पाद",
        book: "बुकिंग करा",
        myBookings: "माझे बुकिंग",
        contactNav: "संपर्क साधा",
        search: "शोधा...",
        userId: "वापरकर्ता आयडी:",
        loadingApp: "ॲप्लिकेशन लोड होत आहे...",
        welcomeTitle: "तुमच्या कारची दृष्टी सुधारा",
        welcomeSubtitle: "उत्कृष्ट हेडलाइट्स आणि सेवांसाठी एकच ठिकाण.",
        ourServices: "आमच्या सेवा",
        featuredProducts: "वैशिष्ट्यीकृत उत्पादने",
        view: "पहा",
        bookAppointment: "अपॉइंटमेंट बुक करा",
        contactUs: "आमच्याशी संपर्क साधा",
        headlightRestoration: "हेडलाइट पुनर्संचयन",
        headlightReplacement: "हेडलाइट बदलणे",
        fogLightInstallation: "फॉग लाइट इन्स्टॉलेशन",
        mirrorReplacement: "आरसा बदलणे",
        newArrivals: "नवीन आगमन",
        usedParts: "वापरलेले भाग",
        specialistBrands: "विशेषज्ञ ब्रँड्स",
        headlightRestorationDesc: "मंद झालेल्या हेडलाइट्सला त्यांची मूळ स्पष्टता आणि चमक परत आणा.",
        headlightReplacementDesc: "दृश्यमानता आणि सौंदर्य सुधारण्यासाठी नवीन हेडलाइट्स स्थापित करा.",
        fogLightInstallationDesc: "शक्तिशाली फॉग लाइट्समुळे धुक्याच्या स्थितीत दृश्यमानता वाढवा.",
        mirrorReplacementDesc: "तुटलेले किंवा खराब झालेले आरसे दर्जेदार भागांनी बदला.",
        newArrivalsDesc: "नवीनतम आणि ट्रेंडिएस्ट लाइटिंग कलेक्शन एक्सप्लोर करा.",
        usedPartsDesc: "परवडणारे, चांगल्या दर्जाचे वापरलेले भाग.",
        specialistBrandsDesc: "मारुती, होंडा, हुंडई, टोयोटा आणि इतरांमध्ये तज्ञ.",
        allOurServices: "आमच्या सर्व सेवा",
        learnMore: "अधिक जाणून घ्या",
        serviceDetail: "सेवा तपशील",
        benefits: "फायदे",
        estimatedTime: "अंदाजित वेळ:",
        productsTitle: "आमची उत्पादने",
        productDetail: "उत्पादनाचे तपशील",
        price: "किंमत:",
        specifications: "तपशील:",
        compatibility: "सुसंगतता:",
        generateNewImage: "नवीन प्रतिमा तयार करा",
        generatingImage: "प्रतिमा तयार होत आहे...",
        generatedImage: "तयार केलेली प्रतिमा:",
        imageCouldNotBeGenerated: "प्रतिमा तयार केली जाऊ शकली नाही. कृपया पुन्हा प्रयत्न करा.",
        failedToGenerateImage: "प्रतिमा तयार करण्यात अयशस्वी:",
        aiProductInsights: "✨ एआय उत्पादनाची माहिती ✨",
        generatingInsights: "माहिती तयार होत आहे...",
        productInsights: "उत्पादनाची माहिती:",
        failedToGenerateInsights: "माहिती तयार करण्यात अयशस्वी.",
        selectServiceType: "सेवेचा प्रकार निवडा:",
        selectService: "सेवा निवडा",
        vehicleMake: "वाहनाचा ब्रँड (उदा. मारुती, होंडा):",
        vehicleModel: "वाहनाचा मॉडेल (उदा. स्विफ्ट, सिटी):",
        appointmentDate: "अपॉइंटमेंटची तारीख:",
        appointmentTime: "अपॉइंटमेंटची वेळ:",
        yourName: "तुमचे नाव:",
        yourPhoneNumber: "तुमचा फोन नंबर:",
        requiredFields: "कृपया सर्व आवश्यक फील्ड भरा.",
        bookingSuccess: "तुमची अपॉइंटमेंट यशस्वीरित्या बुक झाली आहे. आम्ही लवकरच तुमच्याशी संपर्क साधू.",
        bookingFailed: "अपॉइंटमेंट बुक करताना त्रुटी आली:",
        tryAgain: "कृपया पुन्हा प्रयत्न करा.",
        bookingAppointment: "अपॉइंटमेंट बुक करत आहे...",
        confirmDeletion: "हटविण्याची पुष्टी करा",
        areYouSureToDelete: "तुम्ही अपॉइंटमेंट हटवू इच्छिता याची खात्री आहे का?",
        yesDelete: "होय, हटवा",
        noCancel: "नाही, रद्द करा",
        noAppointments: "तुमच्याकडे कोणतीही अपॉइंटमेंट नाही.",
        bookOneNow: "आता एक बुक करा!",
        vehicle: "वाहन:",
        date: "तारीख:",
        time: "वेळ:",
        contactPerson: "संपर्क:",
        reschedule: "पुनर्नियोजित करा",
        cancel: "रद्द करा",
        errorFetchingAppointments: "अपॉइंटमेंट मिळवताना त्रुटी आली.",
        myAppointments: "माझे बुकिंग",
        aboutUs: "आमच्याबद्दल",
        owner: "मालिक:",
        aboutKohinoor: "कोहिनूर लाइट्स बद्दल",
        mission: "आमचे ध्येय",
        missionText: "आमच्या ग्राहकांना सुरक्षितता आणि शैली सुनिश्चित करून, सर्वोत्तम कार लाइटिंग सोल्यूशन्स आणि सेवा प्रदान करणे.",
        faqs: "वारंवार विचारले जाणारे प्रश्न",
        faq1Q: "तुम्ही कोणत्या सेवा प्रदान करता?",
        faq1A: "आम्ही हेडलाइट पुनर्संचयन, बदलणे, फॉग लाइट इन्स्टॉलेशन, आरसा बदलणे आणि कस्टम लाइटिंग सोल्यूशन्स प्रदान करतो.",
        faq2Q: "तुम्ही कोणत्या कार ब्रँडमध्ये तज्ञ आहात?",
        faq2A: "आम्ही मारुती, टाटा, होंडा, हुंडई, इनोवा, ओपल, फोर्ड, सँट्रो, टोयोटा आणि इतरांमध्ये तज्ञ आहोत.",
        testimonials: "ग्राहक प्रशंसापत्रे",
        testi1: "उत्कृष्ट सेवा! माझ्या कारच्या हेडलाइट्स अगदी नवीन दिसतात.",
        testi2: "खूप व्यावसायिक आणि जलद. कोहिनूर लाइट्सची शिफारस करतो!",
        testi3: "उत्पादनांची उत्तम निवड आणि तज्ञ स्थापना.",
        ourAddress: "आमचा पत्ता",
        viewOnMap: "नकाशावर पहा",
        phoneNumbers: "फोन नंबर",
        email: "ईमेल",
        workingHours: "कामाचे तास",
        followUs: "आमचे अनुसरण करा",
        mondayToSaturday: "सोमवार - शनिवार: सकाळी 9:00 - संध्याकाळी 7:00",
        sunday: "रविवार: बंद",
        aiChat: "एआय चॅट",
        askAboutLights: "कार लाइट्स किंवा आमच्या सेवांबद्दल काहीही विचारा...",
        sendMessage: "संदेश पाठवा",
        aiThinking: "एआय विचार करत आहे...",
        aiChatIntro: "नमस्कार! मी तुमच्या Kohinoor Lights ॲपचा AI असिस्टंट आहे। तुम्ही मला कार लाइट्स किंवा आमच्या सेवांबद्दल काहीही विचारू शकता।",
        personalizedServiceSuggestion: "✨ वैयक्तिक सेवा सूचना ✨",
        describeYourIssue: "तुमच्या कारची समस्या किंवा गरजा वर्णन करा:",
        suggestServices: "सेवा सुचवा",
        aiServiceSuggestion: "एआय सेवा सूचना:",
        noSuggestionFound: "कोणतीही सूचना सापडली नाही। कृपया पुन्हा प्रयत्न करा।",
        generatingSuggestion: "सूचना तयार होत आहे...",
        appNotReady: "ॲप तयार नाही। कृपया थोड्या वेळात पुन्हा प्रयत्न करा।",
        errorDeletingAppointment: "अपॉइंटमेंट हटवताना त्रुटी आली।",
        loadingAppointments: "अपॉइंटमेंट लोड होत आहेत..."
    }
};

// --- Context for Firebase, User Data, and Language ---
const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [language, setLanguage] = useState('hi'); // Default language is Hindi

    const t = (key) => translations[language][key] || key; // Translation function

    useEffect(() => {
        const initializeFirebase = async () => {
            try {
                // Access __app_id and __firebase_config directly from the global scope (Canvas environment)
                const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
                const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');

                if (Object.keys(firebaseConfig).length === 0 || !firebaseConfig.projectId) {
                    console.error("Firebase config is empty or invalid. Please ensure __firebase_config is correctly set.");
                    const dummyConfig = {
                        apiKey: "dummy-key",
                        authDomain: "dummy-domain.firebaseapp.com",
                        projectId: "dummy-project",
                        storageBucket: "dummy-bucket.appspot.com",
                        messagingSenderId: "1234567890",
                        appId: "1:1234567890:web:abcdef1234567890"
                    };
                    const app = initializeApp(dummyConfig);
                    const authInstance = getAuth(app);
                    const dbInstance = getFirestore(app);
                    setAuth(authInstance);
                    setDb(dbInstance);
                } else {
                    const app = initializeApp(firebaseConfig);
                    const authInstance = getAuth(app);
                    const dbInstance = getFirestore(app);
                    setAuth(authInstance);
                    setDb(dbInstance);
                }
            } catch (error) {
                console.error("Failed to initialize Firebase:", error);
            }
        };

        initializeFirebase();
    }, []);

    useEffect(() => {
        if (auth) {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    setUserId(user.uid);
                    setIsAuthReady(true);
                } else {
                    try {
                        if (typeof __initial_auth_token !== 'undefined') {
                            await signInWithCustomToken(auth, __initial_auth_token);
                        } else {
                            await signInAnonymously(auth);
                        }
                    } catch (error) {
                        console.error("Firebase anonymous sign-in failed:", error);
                    }
                }
            });
            return () => unsubscribe();
        }
    }, [auth]);

    return (
        <AppContext.Provider value={{ db, auth, userId, isAuthReady, language, setLanguage, t }}>
            {children}
        </AppContext.Provider>
    );
};

// --- Custom Hooks for Firebase and Language Context ---
const useFirebase = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useFirebase must be used within an AppProvider');
    }
    return { db: context.db, auth: context.auth, userId: context.userId, isAuthReady: context.isAuthReady };
};

const useLanguage = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useLanguage must be used within an AppProvider');
    }
    return { language: context.language, setLanguage: context.setLanguage, t: context.t };
};

// --- Components ---

// Modal Component for alerts and confirmations
const Modal = ({ show, title, message, onConfirm, onCancel, showCancel = false }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
                <h3 className="text-xl font-bold mb-4 text-gray-800">{title}</h3>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    {showCancel && (
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};


const servicesData = [
    {
        id: 'headlight-restoration',
        nameKey: 'headlightRestoration',
        descKey: 'headlightRestorationDesc',
        benefits: ["Improved visibility", "Enhanced aesthetics", "Cost-effective"],
        estimatedTime: "1-2 hours"
    },
    {
        id: 'headlight-replacement',
        nameKey: 'headlightReplacement',
        descKey: 'headlightReplacementDesc',
        benefits: ["Optimal illumination", "Modern look", "Safety improvement"],
        estimatedTime: "2-4 hours"
    },
    {
        id: 'fog-light-installation',
        nameKey: 'fogLightInstallation',
        descKey: 'fogLightInstallationDesc',
        benefits: ["Better visibility in fog", "Increased safety", "Stylish addition"],
        estimatedTime: "1-3 hours"
    },
    {
        id: 'mirror-replacement',
        nameKey: 'mirrorReplacement',
        descKey: 'mirrorReplacementDesc',
        benefits: ["Clear rear view", "Safety compliance", "Restore original function"],
        estimatedTime: "30 mins - 1 hour"
    },
];

const productsData = [
    {
        id: 'new-arrivals',
        nameKey: 'newArrivals',
        descKey: 'newArrivalsDesc',
        price: '₹2500 - ₹15000',
        specifications: ['LED', 'Halogen', 'Xenon', 'Projector'],
        compatibility: ['Universal', 'Specific Models']
    },
    {
        id: 'used-parts',
        nameKey: 'usedParts',
        descKey: 'usedPartsDesc',
        price: '₹500 - ₹5000',
        specifications: ['OEM parts', 'Tested quality', 'Various conditions'],
        compatibility: ['Wide Range of Models']
    },
    {
        id: 'specialist-brands',
        nameKey: 'specialistBrands',
        descKey: 'specialistBrandsDesc',
        price: 'Varies',
        specifications: ['Maruti', 'Honda', 'Tata', 'Hyundai', 'Toyota', 'Ford', 'Skoda', 'Volkswagen', 'BMW', 'Mercedes-Benz'],
        compatibility: ['Brand Specific']
    },
];

const Header = ({ onSearch, currentPage, setCurrentPage }) => {
    const { userId, isAuthReady } = useFirebase();
    const { t, setLanguage, language } = useLanguage();

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    return (
        <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg p-4 sticky top-0 z-40">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <h1 className="text-3xl font-extrabold mb-3 md:mb-0 transform hover:scale-105 transition-transform duration-300">
                    {t('appName')}
                </h1>

                <nav className="flex-grow">
                    <ul className="flex flex-wrap justify-center md:justify-end space-x-4 md:space-x-6 text-lg font-medium">
                        <li><button onClick={() => setCurrentPage('home')} className={`hover:text-blue-200 transition-colors duration-200 ${currentPage === 'home' ? 'border-b-2 border-white' : ''}`}>{t('home')}</button></li>
                        <li><button onClick={() => setCurrentPage('services')} className={`hover:text-blue-200 transition-colors duration-200 ${currentPage === 'services' ? 'border-b-2 border-white' : ''}`}>{t('services')}</button></li>
                        <li><button onClick={() => setCurrentPage('products')} className={`hover:text-blue-200 transition-colors duration-200 ${currentPage === 'products' ? 'border-b-2 border-white' : ''}`}>{t('products')}</button></li>
                        <li><button onClick={() => setCurrentPage('book')} className={`hover:text-blue-200 transition-colors duration-200 ${currentPage === 'book' ? 'border-b-2 border-white' : ''}`}>{t('book')}</button></li>
                        <li><button onClick={() => setCurrentPage('myBookings')} className={`hover:text-blue-200 transition-colors duration-200 ${currentPage === 'myBookings' ? 'border-b-2 border-white' : ''}`}>{t('myBookings')}</button></li>
                        <li><button onClick={() => setCurrentPage('contact')} className={`hover:text-blue-200 transition-colors duration-200 ${currentPage === 'contact' ? 'border-b-2 border-white' : ''}`}>{t('contactNav')}</button></li>
                        <li><button onClick={() => setCurrentPage('aiChat')} className={`hover:text-blue-200 transition-colors duration-200 ${currentPage === 'aiChat' ? 'border-b-2 border-white' : ''}`}>{t('aiChat')}</button></li>
                    </ul>
                </nav>

                <div className="flex items-center space-x-4 mt-3 md:mt-0">
                    <div className="relative">
                        <select
                            value={language}
                            onChange={handleLanguageChange}
                            className="block appearance-none bg-blue-800 border border-blue-600 text-white py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-blue-700 focus:border-blue-500 transition-colors duration-200"
                        >
                            <option value="en">English</option>
                            <option value="hi">हिन्दी</option>
                            <option value="mr">मराठी</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
                        </div>
                    </div>
                </div>
            </div>
            {isAuthReady && userId && (
                <div className="text-center md:text-right text-sm mt-2">
                    <span className="font-semibold">{t('userId')}</span> {userId}
                </div>
            )}
        </header>
    );
};

const Footer = () => {
    const { t } = useLanguage();
    return (
        <footer className="bg-gray-800 text-white py-8 px-4 mt-12">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} {t('appName')}. All rights reserved.</p>
                <div className="flex justify-center space-x-6 mt-4">
                    <a href="#" className="hover:text-blue-400 transition-colors duration-200"><i className="fab fa-facebook-f"></i></a>
                    <a href="#" className="hover:text-blue-400 transition-colors duration-200"><i className="fab fa-twitter"></i></a>
                    <a href="#" className="hover:text-blue-400 transition-colors duration-200"><i className="fab fa-instagram"></i></a>
                    <a href="#" className="hover:text-blue-400 transition-colors duration-200"><i className="fab fa-linkedin-in"></i></a>
                </div>
            </div>
        </footer>
    );
};

const HomePage = ({ setCurrentPage }) => {
    const { t } = useLanguage();
    return (
        <div className="p-4 md:p-8">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl shadow-lg p-8 md:p-12 mb-12 text-center transform hover:scale-[1.01] transition-transform duration-300 ease-in-out">
                <h2 className="text-4xl md:text-6xl font-extrabold mb-4 animate-fadeInUp">{t('welcomeTitle')}</h2>
                <p className="text-lg md:text-xl mb-8 animate-fadeInUp delay-200">{t('welcomeSubtitle')}</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                        onClick={() => setCurrentPage('book')}
                        className="bg-white text-blue-800 px-8 py-3 rounded-full shadow-lg hover:bg-blue-100 hover:text-blue-900 transition-all duration-300 text-lg font-semibold animate-pulse"
                    >
                        {t('bookAppointment')}
                    </button>
                    <button
                        onClick={() => setCurrentPage('contact')}
                        className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full shadow-lg hover:bg-white hover:text-blue-800 transition-all duration-300 text-lg font-semibold"
                    >
                        {t('contactUs')}
                    </button>
                </div>
            </section>

            {/* Services Section */}
            <section className="mb-12">
                <h3 className="text-3xl font-bold text-gray-800 text-center mb-8">{t('ourServices')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {servicesData.slice(0, 4).map(service => (
                        <div key={service.id} className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col">
                            <h4 className="text-xl font-bold text-gray-800 mb-3">{t(service.nameKey)}</h4>
                            <p className="text-gray-600 text-sm flex-grow mb-4">{t(service.descKey)}</p>
                            <button
                                onClick={() => setCurrentPage('services', { serviceId: service.id })}
                                className="mt-auto bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200 self-start"
                            >
                                {t('learnMore')}
                            </button>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-10">
                    <button
                        onClick={() => setCurrentPage('services')}
                        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-full shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 text-lg font-semibold"
                    >
                        {t('allOurServices')}
                    </button>
                </div>
            </section>

            {/* Products Section */}
            <section className="mb-12">
                <h3 className="text-3xl font-bold text-gray-800 text-center mb-8">{t('featuredProducts')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {productsData.map(product => (
                        <div key={product.id} className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col">
                            <h4 className="text-xl font-bold text-gray-800 mb-3">{t(product.nameKey)}</h4>
                            <p className="text-gray-600 text-sm flex-grow mb-4">{t(product.descKey)}</p>
                            <button
                                onClick={() => setCurrentPage('products', { productId: product.id })}
                                className="mt-auto bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200 self-start"
                            >
                                {t('view')}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Personalized Service Suggestion */}
            <PersonalizedServiceSuggestion />
        </div>
    );
};

const ServicesPage = ({ selectedServiceId, setCurrentPage }) => {
    const { t } = useLanguage();

    const [detailService, setDetailService] = useState(null);

    useEffect(() => {
        if (selectedServiceId) {
            const service = servicesData.find(s => s.id === selectedServiceId);
            setDetailService(service);
        } else {
            setDetailService(null);
        }
    }, [selectedServiceId]);

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">{t('ourServices')}</h2>

            {detailService ? (
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('serviceDetail')}: {t(detailService.nameKey)}</h3>
                    <p className="text-gray-700 mb-4">{t(detailService.descKey)}</p>
                    <p className="font-semibold text-gray-800 mb-2">{t('benefits')}:</p>
                    <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                        {detailService.benefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                        ))}
                    </ul>
                    <p className="font-semibold text-gray-800 mb-6">{t('estimatedTime')} {detailService.estimatedTime}</p>
                    <button
                        onClick={() => setCurrentPage('book', { serviceType: detailService.nameKey })}
                        className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200 mr-4"
                    >
                        {t('bookAppointment')}
                    </button>
                    <button
                        onClick={() => setDetailService(null)}
                        className="bg-gray-300 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-400 transition-colors duration-200"
                    >
                        {t('view')} {t('allOurServices')}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {servicesData.map(service => (
                        <div key={service.id} className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col">
                            <h4 className="text-xl font-bold text-gray-800 mb-3">{t(service.nameKey)}</h4>
                            <p className="text-gray-600 text-sm flex-grow mb-4">{t(service.descKey)}</p>
                            <button
                                onClick={() => setDetailService(service)}
                                className="mt-auto bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200 self-start"
                            >
                                {t('learnMore')}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const ProductsPage = ({ selectedProductId }) => {
    const { t } = useLanguage();

    const [detailProduct, setDetailProduct] = useState(null);
    const [generatedImageUrl, setGeneratedImageUrl] = useState('');
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [productInsights, setProductInsights] = useState('');
    const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');

    useEffect(() => {
        if (selectedProductId) {
            const product = productsData.find(p => p.id === selectedProductId);
            setDetailProduct(product);
            setGeneratedImageUrl(''); // Clear previous image
            setProductInsights(''); // Clear previous insights
        } else {
            setDetailProduct(null);
        }
    }, [selectedProductId]);

    const generateImage = async (productName) => {
        setIsGeneratingImage(true);
        setGeneratedImageUrl('');
        try {
            const prompt = `A highly detailed, realistic image of a car ${productName} light, professional studio lighting, automotive photography.`;
            const payload = { instances: { prompt: prompt }, parameters: { "sampleCount": 1 } };
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
                const imageUrl = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
                setGeneratedImageUrl(imageUrl);
            } else {
                setModalTitle("Error");
                setModalMessage(t('imageCouldNotBeGenerated'));
                setShowModal(true);
                console.error("Failed to generate image: No valid prediction found.", result);
            }
        } catch (error) {
            setModalTitle("Error");
            setModalMessage(`${t('failedToGenerateImage')} ${error.message}. ${t('tryAgain')}`);
            setShowModal(true);
            console.error("Error generating image:", error);
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const generateProductInsights = async (productName, productDesc, specifications) => {
        setIsGeneratingInsights(true);
        setProductInsights('');
        try {
            const prompt = `Provide concise and compelling product insights for a car light product named "${productName}" with the description "${productDesc}" and specifications including: ${specifications.join(', ')}. Highlight key selling points and benefits in a paragraph.`;
            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = { contents: chatHistory };
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                setProductInsights(result.candidates[0].content.parts[0].text);
            } else {
                setModalTitle("Error");
                setModalMessage(t('failedToGenerateInsights'));
                setShowModal(true);
                console.error("Failed to generate product insights: No valid response found.", result);
            }
        } catch (error) {
            setModalTitle("Error");
            setModalMessage(`${t('failedToGenerateInsights')} ${error.message}. ${t('tryAgain')}`);
            setShowModal(true);
            console.error("Error generating product insights:", error);
        } finally {
            setIsGeneratingInsights(false);
        }
    };


    return (
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">{t('productsTitle')}</h2>

            {detailProduct ? (
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('productDetail')}: {t(detailProduct.nameKey)}</h3>
                    <p className="text-gray-700 mb-4">{t(detailProduct.descKey)}</p>
                    <p className="font-semibold text-gray-800 mb-2">{t('price')} {detailProduct.price}</p>
                    <p className="font-semibold text-gray-800 mb-2">{t('specifications')}: {detailProduct.specifications.join(', ')}</p>
                    <p className="font-semibold text-gray-800 mb-6">{t('compatibility')}: {detailProduct.compatibility.join(', ')}</p>

                    <button
                        onClick={() => generateImage(t(detailProduct.nameKey))}
                        className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors duration-200 mr-4 mb-4"
                        disabled={isGeneratingImage}
                    >
                        {isGeneratingImage ? t('generatingImage') : t('generateNewImage')}
                    </button>

                    <button
                        onClick={() => generateProductInsights(t(detailProduct.nameKey), t(detailProduct.descKey), detailProduct.specifications)}
                        className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors duration-200 mb-4"
                        disabled={isGeneratingInsights}
                    >
                        {isGeneratingInsights ? t('generatingInsights') : t('aiProductInsights')}
                    </button>

                    {isGeneratingImage && (
                        <div className="text-center text-blue-600 mt-4">{t('generatingImage')}</div>
                    )}
                    {generatedImageUrl && (
                        <div className="mt-6 text-center">
                            <p className="font-semibold text-gray-800 mb-2">{t('generatedImage')}</p>
                            <img src={generatedImageUrl} alt={t(detailProduct.nameKey)} className="max-w-full h-auto rounded-lg shadow-md mx-auto" />
                        </div>
                    )}

                    {isGeneratingInsights && (
                        <div className="text-center text-blue-600 mt-4">{t('generatingInsights')}</div>
                    )}
                    {productInsights && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="font-semibold text-gray-800 mb-2">{t('productInsights')}</p>
                            <p className="text-gray-700 whitespace-pre-wrap">{productInsights}</p>
                        </div>
                    )}

                    <button
                        onClick={() => setDetailProduct(null)}
                        className="mt-6 bg-gray-300 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-400 transition-colors duration-200"
                    >
                        {t('view')} {t('productsTitle')}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {productsData.map(product => (
                        <div key={product.id} className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col">
                            <h4 className="text-xl font-bold text-gray-800 mb-3">{t(product.nameKey)}</h4>
                            <p className="text-gray-600 text-sm flex-grow mb-4">{t(product.descKey)}</p>
                            <button
                                onClick={() => setDetailProduct(product)}
                                className="mt-auto bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200 self-start"
                            >
                                {t('view')}
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <Modal
                show={showModal}
                title={modalTitle}
                message={modalMessage}
                onConfirm={() => setShowModal(false)}
            />
        </div>
    );
};

const BookAppointmentPage = ({ initialServiceType }) => {
    const { db, userId, isAuthReady } = useFirebase();
    const { t } = useLanguage();

    const [serviceType, setServiceType] = useState(initialServiceType || '');
    const [vehicleMake, setVehicleMake] = useState('');
    const [vehicleModel, setVehicleModel] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [yourName, setYourName] = useState('');
    const [yourPhoneNumber, setYourPhoneNumber] = useState('');
    const [isBooking, setIsBooking] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');

    useEffect(() => {
        if (initialServiceType) {
            const foundService = servicesData.find(s => s.nameKey === initialServiceType);
            if (foundService) {
                setServiceType(foundService.id); // Set the actual ID
            }
        }
    }, [initialServiceType]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!serviceType || !vehicleMake || !vehicleModel || !appointmentDate || !appointmentTime || !yourName || !yourPhoneNumber) {
            setModalTitle("Error");
            setModalMessage(t('requiredFields'));
            setShowModal(true);
            return;
        }

        if (!isAuthReady || !userId || !db) {
            setModalTitle("Error");
            setModalMessage(t('appNotReady'));
            setShowModal(true);
            return;
        }

        setIsBooking(true);
        try {
            const selectedService = servicesData.find(s => s.id === serviceType);
            const serviceName = selectedService ? t(selectedService.nameKey) : serviceType; // Use translated name

            const docRef = await addDoc(collection(db, `artifacts/__app_id/users/${userId}/appointments`), {
                serviceType: serviceName,
                vehicleMake,
                vehicleModel,
                appointmentDate,
                appointmentTime,
                yourName,
                yourPhoneNumber,
                createdAt: new Date().toISOString(),
            });
            console.log("Document written with ID: ", docRef.id);
            setModalTitle("Success");
            setModalMessage(t('bookingSuccess'));
            setShowModal(true);

            // Clear form
            setServiceType(initialServiceType || '');
            setVehicleMake('');
            setVehicleModel('');
            setAppointmentDate('');
            setAppointmentTime('');
            setYourName('');
            setYourPhoneNumber('');

        } catch (e) {
            setModalTitle("Error");
            setModalMessage(`${t('bookingFailed')} ${e.message}. ${t('tryAgain')}`);
            setShowModal(true);
            console.error("Error adding document: ", e);
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">{t('bookAppointment')}</h2>
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-lg mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="serviceType" className="block text-gray-700 text-sm font-bold mb-2">
                            {t('selectServiceType')}
                        </label>
                        <select
                            id="serviceType"
                            value={serviceType}
                            onChange={(e) => setServiceType(e.target.value)}
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                            required
                        >
                            <option value="">{t('selectService')}</option>
                            {servicesData.map(service => (
                                <option key={service.id} value={service.id}>{t(service.nameKey)}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="vehicleMake" className="block text-gray-700 text-sm font-bold mb-2">
                            {t('vehicleMake')}
                        </label>
                        <input
                            type="text"
                            id="vehicleMake"
                            value={vehicleMake}
                            onChange={(e) => setVehicleMake(e.target.value)}
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                            placeholder="Maruti, Honda..."
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="vehicleModel" className="block text-gray-700 text-sm font-bold mb-2">
                            {t('vehicleModel')}
                        </label>
                        <input
                            type="text"
                            id="vehicleModel"
                            value={vehicleModel}
                            onChange={(e) => setVehicleModel(e.target.value)}
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                            placeholder="Swift, City..."
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="appointmentDate" className="block text-gray-700 text-sm font-bold mb-2">
                            {t('appointmentDate')}
                        </label>
                        <input
                            type="date"
                            id="appointmentDate"
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="appointmentTime" className="block text-gray-700 text-sm font-bold mb-2">
                            {t('appointmentTime')}
                        </label>
                        <input
                            type="time"
                            id="appointmentTime"
                            value={appointmentTime}
                            onChange={(e) => setAppointmentTime(e.target.value)}
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="yourName" className="block text-gray-700 text-sm font-bold mb-2">
                            {t('yourName')}
                        </label>
                        <input
                            type="text"
                            id="yourName"
                            value={yourName}
                            onChange={(e) => setYourName(e.target.value)}
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                            placeholder="Your Name"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="yourPhoneNumber" className="block text-gray-700 text-sm font-bold mb-2">
                            {t('yourPhoneNumber')}
                        </label>
                        <input
                            type="tel"
                            id="yourPhoneNumber"
                            value={yourPhoneNumber}
                            onChange={(e) => setYourPhoneNumber(e.target.value)}
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                            placeholder="e.g., 9876543210"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                        disabled={isBooking}
                    >
                        {isBooking ? t('bookingAppointment') : t('bookAppointment')}
                    </button>
                </form>
            </div>
            <Modal
                show={showModal}
                title={modalTitle}
                message={modalMessage}
                onConfirm={() => setShowModal(false)}
            />
        </div>
    );
};

const MyBookingsPage = () => {
    const { db, userId, isAuthReady } = useFirebase();
    const { t } = useLanguage();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalAction, setModalAction] = useState(null); // Function to execute on confirm
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    const [selectedAppointmentName, setSelectedAppointmentName] = useState('');


    useEffect(() => {
        if (!isAuthReady || !userId || !db) {
            setAppointments([]);
            setLoading(true);
            return;
        }

        setLoading(true);
        const q = collection(db, `artifacts/__app_id/users/${userId}/appointments`);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedAppointments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Sort appointments by date and time in memory
            fetchedAppointments.sort((a, b) => {
                const dateA = new Date(`${a.appointmentDate}T${a.appointmentTime}`);
                const dateB = new Date(`${b.appointmentDate}T${b.appointmentTime}`);
                return dateA - dateB;
            });
            setAppointments(fetchedAppointments);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching appointments:", error);
            setModalTitle("Error");
            setModalMessage(t('errorFetchingAppointments'));
            setShowModal(true);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [db, userId, isAuthReady, t]);

    const handleDeleteClick = (appointmentId, serviceType) => {
        setSelectedAppointmentId(appointmentId);
        setSelectedAppointmentName(serviceType);
        setModalTitle(t('confirmDeletion'));
        setModalMessage(`${t('areYouSureToDelete')} ${serviceType}?`);
        setModalAction(() => async () => {
            if (!db || !userId) {
                setModalTitle("Error");
                setModalMessage(t('appNotReady'));
                setShowModal(true);
                return;
            }
            try {
                await deleteDoc(doc(db, `artifacts/__app_id/users/${userId}/appointments`, selectedAppointmentId));
                setModalTitle("Success");
                setModalMessage("Appointment deleted successfully.");
                setShowModal(true);
            } catch (error) {
                setModalTitle("Error");
                setModalMessage(`${t('errorDeletingAppointment')} ${error.message}`);
                setShowModal(true);
                console.error("Error deleting document: ", error);
            } finally {
                setSelectedAppointmentId(null);
                setSelectedAppointmentName('');
                setShowModal(false);
            }
        });
        setShowModal(true);
    };

    const handleReschedule = (appointment) => {
        // In a real application, this would navigate to a booking page
        // with pre-filled data for editing. For this demo, we'll just log.
        setModalTitle("Reschedule");
        setModalMessage(`Rescheduling feature for ${appointment.serviceType} at ${appointment.appointmentDate} ${appointment.appointmentTime} is under development.`);
        setShowModal(true);
        console.log("Reschedule appointment:", appointment);
    };

    if (loading) {
        return (
            <div className="p-4 md:p-8 text-center text-gray-600">
                <p>{t('loadingAppointments')}</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">{t('myAppointments')}</h2>
            {appointments.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 text-center max-w-lg mx-auto">
                    <p className="text-gray-600 text-lg mb-4">{t('noAppointments')}</p>
                    <button
                        className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
                        onClick={() => {/* navigate to book page */ }} // Placeholder for navigation
                    >
                        {t('bookOneNow')}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
                    {appointments.map(appointment => (
                        <div key={appointment.id} className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div>
                                <p className="text-xl font-bold text-gray-800 mb-2">{appointment.serviceType}</p>
                                <p className="text-gray-700 text-sm mb-1"><span className="font-semibold">{t('vehicle')}</span> {appointment.vehicleMake} {appointment.vehicleModel}</p>
                                <p className="text-gray-700 text-sm mb-1"><span className="font-semibold">{t('date')}</span> {appointment.appointmentDate}</p>
                                <p className="text-gray-700 text-sm mb-1"><span className="font-semibold">{t('time')}</span> {appointment.appointmentTime}</p>
                                <p className="text-gray-700 text-sm"><span className="font-semibold">{t('contactPerson')}</span> {appointment.yourName} ({appointment.yourPhoneNumber})</p>
                            </div>
                            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-4 md:mt-0 w-full md:w-auto">
                                <button
                                    onClick={() => handleReschedule(appointment)}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 transition-colors duration-200 text-sm"
                                >
                                    {t('reschedule')}
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(appointment.id, appointment.serviceType)}
                                    className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors duration-200 text-sm"
                                >
                                    {t('cancel')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <Modal
                show={showModal}
                title={modalTitle}
                message={modalMessage}
                onConfirm={() => {
                    if (modalAction) modalAction();
                    else setShowModal(false);
                }}
                onCancel={() => setShowModal(false)}
                showCancel={modalAction !== null}
            />
        </div>
    );
};

const ContactPage = () => {
    const { t } = useLanguage();
    return (
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">{t('contactUs')}</h2>

            <section className="mb-12 bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('aboutUs')}</h3>
                <p className="text-gray-700 mb-4">
                    <span className="font-semibold">{t('owner')}:</span> Mr. Prakash Sharma
                </p>
                <h4 className="text-xl font-bold text-gray-800 mb-2">{t('aboutKohinoor')}</h4>
                <p className="text-gray-700 mb-4">
                    Kohinoor Lights is a leading automotive lighting service provider dedicated to enhancing the safety and aesthetics of your vehicle. With years of experience and a team of skilled technicians, we offer a wide range of services from headlight restoration to advanced lighting solutions. Our commitment to quality and customer satisfaction sets us apart.
                </p>
                <h4 className="text-xl font-bold text-gray-800 mb-2">{t('mission')}</h4>
                <p className="text-gray-700 mb-4">{t('missionText')}</p>
            </section>

            <section className="mb-12 bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('faqs')}</h3>
                <div className="space-y-4">
                    <div>
                        <p className="font-semibold text-gray-800">{t('faq1Q')}</p>
                        <p className="text-gray-700 ml-4">{t('faq1A')}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">{t('faq2Q')}</p>
                        <p className="text-gray-700 ml-4">{t('faq2A')}</p>
                    </div>
                </div>
            </section>

            <section className="mb-12 bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('testimonials')}</h3>
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="italic text-gray-700">" {t('testi1')} "</p>
                        <p className="text-right text-gray-600 mt-2">- Rahul S.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="italic text-gray-700">" {t('testi2')} "</p>
                        <p className="text-right text-gray-600 mt-2">- Priya D.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="italic text-gray-700">" {t('testi3')} "</p>
                        <p className="text-right text-gray-600 mt-2">- Amit K.</p>
                    </div>
                </div>
            </section>

            <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('ourAddress')}</h3>
                <p className="text-gray-700 mb-2">123, Auto Light Street,</p>
                <p className="text-gray-700 mb-2">Car Accessories Market,</p>
                <p className="text-gray-700 mb-4">Mumbai, Maharashtra, 400001, India</p>
                <a
                    href="https://www.google.com/maps/search/123+Auto+Light+Street,Car+Accessories+Market,Mumbai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center mb-6"
                >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                    {t('viewOnMap')}
                </a>

                <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('phoneNumbers')}</h3>
                <p className="text-gray-700 mb-2">Main: +91 98765 43210</p>
                <p className="text-gray-700 mb-6">Support: +91 99887 66554</p>

                <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('email')}</h3>
                <p className="text-blue-600 hover:underline mb-6">info@kohinoorlights.com</p>

                <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('workingHours')}</h3>
                <p className="text-gray-700 mb-2">{t('mondayToSaturday')}</p>
                <p className="text-gray-700 mb-6">{t('sunday')}</p>

                <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('followUs')}</h3>
                <div className="flex space-x-4">
                    <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                        <i className="fab fa-facebook-f text-3xl"></i>
                    </a>
                    <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                        <i className="fab fa-twitter text-3xl"></i>
                    </a>
                    <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                        <i className="fab fa-instagram text-3xl"></i>
                    </a>
                </div>
            </section>
        </div>
    );
};

const AIChatPage = () => {
    const { t } = useLanguage();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);

    useEffect(() => {
        setMessages([{ role: 'ai', text: t('aiChatIntro') }]);
    }, [t]);

    const sendMessage = async () => {
        if (input.trim() === '') return;

        const userMessage = { role: 'user', text: input.trim() };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput('');
        setIsThinking(true);

        try {
            const chatHistory = [...messages, userMessage].map(msg => ({
                role: msg.role === 'ai' ? 'model' : 'user',
                parts: [{ text: msg.text }]
            }));

            const payload = { contents: chatHistory };
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const aiResponse = { role: 'ai', text: result.candidates[0].content.parts[0].text };
                setMessages((prevMessages) => [...prevMessages, aiResponse]);
            } else {
                setMessages((prevMessages) => [...prevMessages, { role: 'ai', text: "Sorry, I couldn't process that. Please try again." }]);
                console.error("AI chat failed: No valid response found.", result);
            }
        } catch (error) {
            setMessages((prevMessages) => [...prevMessages, { role: 'ai', text: "There was an error connecting to the AI. Please try again." }]);
            console.error("Error in AI chat:", error);
        } finally {
            setIsThinking(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isThinking) {
            sendMessage();
        }
    };

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">{t('aiChat')}</h2>
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-2xl mx-auto flex flex-col h-[60vh]">
                <div className="flex-grow overflow-y-auto mb-4 p-2 border rounded-lg bg-gray-50">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`mb-3 p-3 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'bg-blue-100 self-end ml-auto' : 'bg-gray-200 self-start mr-auto'}`}
                        >
                            <p className="text-gray-800">{msg.text}</p>
                        </div>
                    ))}
                    {isThinking && (
                        <div className="mb-3 p-3 rounded-lg bg-gray-200 self-start mr-auto">
                            <p className="text-gray-800 italic">{t('aiThinking')}</p>
                        </div>
                    )}
                </div>
                <div className="flex">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={t('askAboutLights')}
                        className="flex-grow shadow appearance-none border rounded-l-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                        disabled={isThinking}
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                        disabled={isThinking}
                    >
                        {t('sendMessage')}
                    </button>
                </div>
            </div>
        </div>
    );
};

const PersonalizedServiceSuggestion = () => {
    const { t } = useLanguage();
    const [issueDescription, setIssueDescription] = useState('');
    const [suggestion, setSuggestion] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');

    const getServiceNames = () => {
        return servicesData.map(service => t(service.nameKey)).join(', ');
    };

    const generateSuggestion = async () => {
        if (issueDescription.trim() === '') {
            setModalTitle("Error");
            setModalMessage(t('describeYourIssue'));
            setShowModal(true);
            return;
        }

        setIsGenerating(true);
        setSuggestion('');

        try {
            const prompt = `Based on the following car issue: "${issueDescription}", suggest the most appropriate service from Kohinoor Lights. Our services include: ${getServiceNames()}. Provide a concise suggestion and explain why it's suitable. If no direct service matches, suggest a general check-up.`;
            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = { contents: chatHistory };
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                setSuggestion(result.candidates[0].content.parts[0].text);
            } else {
                setModalTitle("Error");
                setModalMessage(t('noSuggestionFound'));
                setShowModal(true);
                console.error("AI service suggestion failed: No valid response found.", result);
            }
        } catch (error) {
            setModalTitle("Error");
            setModalMessage(`${t('noSuggestionFound')} ${error.message}`);
            setShowModal(true);
            console.error("Error generating service suggestion:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <section className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl shadow-lg p-6 md:p-8 mt-12 mb-12 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-6">{t('personalizedServiceSuggestion')}</h3>
            <div className="mb-4">
                <label htmlFor="issueDescription" className="block text-white text-sm font-bold mb-2">
                    {t('describeYourIssue')}
                </label>
                <textarea
                    id="issueDescription"
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    rows="3"
                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-300 transition duration-150 ease-in-out"
                    placeholder="E.g., 'My headlights are dim and yellowed' or 'I need brighter lights for night driving'"
                ></textarea>
            </div>
            <button
                onClick={generateSuggestion}
                className="bg-white text-emerald-700 px-6 py-2 rounded-full hover:bg-gray-100 transition-colors duration-200 font-semibold w-full sm:w-auto"
                disabled={isGenerating}
            >
                {isGenerating ? t('generatingSuggestion') : t('suggestServices')}
            </button>

            {isGenerating && (
                <div className="text-center text-white mt-4">{t('generatingSuggestion')}</div>
            )}
            {suggestion && (
                <div className="mt-6 p-4 bg-white bg-opacity-90 rounded-lg border border-teal-200 text-gray-800">
                    <p className="font-semibold mb-2">{t('aiServiceSuggestion')}</p>
                    <p className="whitespace-pre-wrap">{suggestion}</p>
                </div>
            )}
            <Modal
                show={showModal}
                title={modalTitle}
                message={modalMessage}
                onConfirm={() => setShowModal(false)}
            />
        </section>
    );
};

// Main App Component
function App() {
    const { isAuthReady } = useFirebase();
    const { t } = useLanguage();

    const [currentPage, setCurrentPage] = useState('home');
    const [pageProps, setPageProps] = useState({});

    const navigate = (page, props = {}) => {
        setCurrentPage(page);
        setPageProps(props);
    };

    if (!isAuthReady) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-2xl font-semibold text-blue-700 animate-pulse">
                    {t('loadingApp')}
                </div>
            </div>
        );
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage setCurrentPage={navigate} />;
            case 'services':
                return <ServicesPage selectedServiceId={pageProps.serviceId} setCurrentPage={navigate} />;
            case 'products':
                return <ProductsPage selectedProductId={pageProps.productId} />;
            case 'book':
                return <BookAppointmentPage initialServiceType={pageProps.serviceType} />;
            case 'myBookings':
                return <MyBookingsPage />;
            case 'contact':
                return <ContactPage />;
            case 'aiChat':
                return <AIChatPage />;
            default:
                return <HomePage setCurrentPage={navigate} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-inter">
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                body {
                    font-family: 'Inter', sans-serif;
                }
                .animate-fadeInUp {
                    animation: fadeInUp 1s ease-out forwards;
                    opacity: 0;
                }
                .delay-200 { animation-delay: 0.2s; }
                .delay-400 { animation-delay: 0.4s; }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: .5;
                    }
                }
                `}
            </style>
            <Header currentPage={currentPage} setCurrentPage={navigate} />
            <main className="container mx-auto py-8">
                {renderPage()}
            </main>
            <Footer />
        </div>
    );
}

export default function KohinoorLightsApp() {
    return (
        <AppProvider>
            <App />
        </AppProvider>
    );
}

