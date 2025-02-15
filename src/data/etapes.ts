// data/etapes.ts

const etapes = [
  {
    id: 1,
    titre: "Préparation de la chaudière",
    description: "Suivez les étapes pour préparer la chaudière.",
    sousEtapes: [
      "Mettre la turbine à gaz (TG) en service (70 à 80 MW de préférence).",
      "Remplir la chaudière en utilisant le circuit SER et ouvrir les évents HV701 et HV702.",
      "Mettre en service les pompes API et APB.",
      "Remplir les ballons HP et BP jusqu'aux niveaux de démarrage spécifiés : HP = -475 mm + 150 mm, BP = -580 mm + 100 mm.",
      "Ouvrir les vannes motorisées d'évent FSR UV008 et FLB UV008.",
      "Ouvrir les vannes de purge de pot de condensat FSR UV010 et FLB UV010.",
    ],
  },
  {
    id: 2,
    titre: "Conditions d'armement de la chaudière",
    description: "Vérifiez les conditions d'armement de la chaudière.",
    sousEtapes: [
      "La chaudière est considérée comme armée lorsque le registre est ouvert.",
      "La turbine à vapeur (TV) est armée lorsque les vannes d'arrêt sont ouvertes.",
    ],
  },
  {
    id: 3,
    titre: "Sécurité chaudière (FSE)",
    description:
      "Assurez-vous que toutes les conditions de sécurité sont remplies.",
    sousEtapes: [
      "La turbine à gaz associée doit être synchronisée.",
      "Au moins une pompe API et une pompe APB doivent être en service.",
      "Une pompe CEX doit être en service.",
      "Une pompe FSR doit être en service avec une pression correcte.",
      "Une pompe FLB doit être en service avec une pression correcte.",
      "Le niveau de gonflement des ballons HP et BP doit être détecté : HP = -475 mm, BP = -580 mm.",
      "Absence d'eau dans le pot de condensat de vapeur de surchauffe HP et BP.",
    ],
  },
  {
    id: 4,
    titre: "Conditions de disponibilité de contournement",
    description: "Vérifiez les conditions de disponibilité de contournement.",
    sousEtapes: [
      "La chaudière doit être armée.",
      "Le registre de la chaudière ne doit pas être fermé.",
      "Aucun défaut sur l'unité hydraulique.",
      "L'armoire de contournement doit être en service (ON).",
      "La pression de l'eau de désurchauffe doit être correcte (P < 16 bars).",
      "Au moins un demi-condenseur doit être réfrigéré (vannes d'entrée et de sortie ouvertes).",
      "Le vide du condenseur doit être correct (pression inférieure à 300 mbar).",
      "La température de la vapeur surchauffée doit être élevée (> 300°C).",
    ],
  },
  {
    id: 5,
    titre: "Démarrage du groupe CET",
    description: "Suivez les étapes pour démarrer le groupe CET.",
    sousEtapes: [
      "Lorsque la pression SVA est à 7 bars et la température à 250°C, le groupe CET s'ouvre.",
      "Le groupe CET déclenche (ouverture de la vanne SVA) à P = 11 bars et T = 325°C.",
      "Les paramètres de démarrage du groupe CET sont : 180°C et 1.2 bars.",
      "Mettre en service le groupe CV1 :",
      "   - À 1 bar, l'éjecteur de démarrage se met en marche.",
      "   - À 250 mbar, l'éjecteur d'entretien se met en service.",
      "   - À 150 mbar, l'éjecteur de démarrage s'arrête.",
    ],
  },
  {
    id: 6,
    titre: "Couplage des chaudières",
    description: "Suivez les étapes pour coupler les chaudières.",
    sousEtapes: [
      "Conditions d'ouverture de la vanne d'isolement HP UV001/UV002 :",
      "   - T ≥ 450°C au niveau du capteur BXVVPTSHQ01 ou BLVVPTSHQ01.",
      "   - ΔP ≤ 2 bars.",
      "Conditions d'ouverture de la vanne d'isolement BP UV001/UV002 :",
      "   - T ≥ 175°C au niveau du capteur BXVVPTSHQ02 ou BLVVPTSHQ02.",
      "   - ΔP ≤ 0.5 bars.",
      "Confirmer la fin de disposition de la chaudière avec le chimiste.",
    ],
  },
];

export default etapes;
