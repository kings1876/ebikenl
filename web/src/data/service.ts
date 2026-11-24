// Customer-service and policy pages (Dutch only, like the blog). Written for this shop from what the site itself states:
// payment by bank transfer or crypto, free delivery in the Netherlands, new bikes with manufacturer warranty.
// Anything that is a business decision rather than a fact (return costs, response times, legal entity) is marked "REVIEW"
// in a comment and must be confirmed by the owner before the pages go live.

export const SERVICE_UPDATED = '24 november 2026';

export type ServiceSection = { h: string; p?: string[]; ul?: string[]; ol?: string[] };
export type ServicePage = {
  slug: string;
  /** short label for menus and breadcrumbs */
  label: string;
  title: string;
  description: string;
  intro: string;
  sections: ServiceSection[];
};

const EMAIL = 'verkoop@e-bike-tekoop.nl';
const NAME = 'EBIKE TE KOOP';
export const ADDRESS = 'Keizersgracht 123, 1015 CW Amsterdam, Nederland';

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: 'bestellen',
    label: 'Bestellen',
    title: 'Bestellen: zo werkt het',
    description: `Zo bestel je een e-bike bij ${NAME}: kiezen, afrekenen zonder account, betaalgegevens per e-mail en bevestiging van de levertijd.`,
    intro: `Een e-bike bestellen bij ${NAME} duurt een paar minuten. Hieronder lees je stap voor stap wat er gebeurt, van je keuze tot de bevestiging.`,
    sections: [
      {
        h: 'Stap voor stap',
        ol: [
          'Kies een model in het assortiment, of laat de keuzehulp een voorstel doen.',
          'Kies op de productpagina je framemaat, kleur en de manier van bezorgen: 100% rijklaar of in de fabrieksdoos.',
          'Leg de e-bike in de winkelwagen en ga naar afrekenen.',
          'Vul je naam, e-mailadres, telefoonnummer en bezorgadres in en kies je betaalmethode. Je telefoonnummer gebruiken we voor de bezorgafspraak.',
          'Je ontvangt per e-mail een bevestiging met je ordernummer.',
          'Daarna mailen we je de betaalgegevens voor de betaalmethode die je koos. Zodra we je betaling hebben ontvangen is je bestelling definitief en bevestigen we de levertijd.',
        ],
      },
      {
        h: 'Wat gebeurt er na je bestelling?',
        ul: [
          'Direct na het afrekenen ontvang je een e-mail met je ordernummer.',
          'Daarna volgt een tweede e-mail met de betaalgegevens voor de betaalmethode die je koos.',
          'Zodra we je betaling hebben ontvangen, bevestigen we je bestelling en de levertijd.',
          'Vlak voor de bezorging maakt de bezorger een afspraak met je op het telefoonnummer dat je hebt opgegeven.',
        ],
      },
      {
        h: 'Geen account nodig',
        p: ['Je kunt bestellen zonder een account aan te maken. Alles wat we nodig hebben vul je in bij het afrekenen.'],
      },
      {
        h: 'Je bestelling wijzigen',
        p: [
          'Wil je nog iets aanpassen, bijvoorbeeld de framemaat, de kleur of het bezorgadres? Mail ons dan zo snel mogelijk met je ordernummer. We laten je weten of het nog kan.',
          'Wil je de bestelling niet meer? Lees dan de pagina over retourneren en herroepen.',
        ],
      },
      {
        h: 'Twijfel je tussen modellen?',
        ul: [
          'Gebruik de keuzehulp: beantwoord een paar vragen en zie welke e-bikes bij je gebruik passen.',
          'Zet e-bikes naast elkaar op de vergelijkpagina en bekijk motor, accu, gewicht en prijs.',
          'Lees de koopgidsen op de blog over onder meer accu, motor en framemaat.',
          `Mail je vraag naar ${EMAIL}; we helpen je graag bij het kiezen van een model en een maat.`,
        ],
      },
      {
        h: 'Bestellen via je werkgever',
        p: ['Wil je een e-bike aanvragen via een fietsplan (WKR)? Op de pagina Fietsplan lees je hoe dat werkt. Onze factuur voldoet aan de eisen voor WKR, FiscFree en Hellorider.'],
      },
    ],
  },
  {
    slug: 'betalen',
    label: 'Betalen',
    title: 'Betalen: bankoverschrijving of crypto',
    description: `Betalen bij ${NAME}: per bankoverschrijving of met crypto (BTC, USDT of ETH) met 10% korting. Zo ontvang je de betaalgegevens.`,
    intro: 'Je betaalt vooraf, per bankoverschrijving of met crypto. Op deze pagina lees je hoe dat werkt.',
    sections: [
      {
        h: 'Betaalmethoden',
        ul: [
          'Bankoverschrijving: je boekt het bedrag vooraf over naar onze rekening.',
          'Crypto (BTC, USDT of ETH): je betaalt naar het adres en netwerk dat je per e-mail ontvangt. Hiervoor geldt 10% korting op het totaalbedrag.',
        ],
      },
      {
        h: 'Zo ontvang je de betaalgegevens',
        p: [
          'Bij het afrekenen betaal je nog niet. Nadat je je bestelling hebt geplaatst, mailen we je de gegevens voor de betaalmethode die je koos: onze rekeninggegevens of het adres en netwerk voor crypto.',
          'In die e-mail staat ook een link naar een pagina waar je elk gegeven met één tik kunt kopiëren. Vermeld bij een bankoverschrijving je ordernummer als betalingskenmerk, zodat we je betaling snel kunnen koppelen.',
        ],
      },
      {
        h: 'Prijzen en factuur',
        p: ['Alle prijzen op de website zijn in euro’s en inclusief 21% btw. Je ontvangt een factuur voor je bestelling. Voor een fietsplan via je werkgever voldoet de factuur aan de gebruikelijke eisen.'],
      },
      {
        h: 'Betalen met crypto',
        ul: [
          'De prijs in euro’s blijft leidend. We rekenen het bedrag om naar de gekozen munt en vermelden het exacte bedrag in de e-mail.',
          'Stuur het bedrag naar het juiste adres en via het juiste netwerk. Een crypto-betaling kan niet worden teruggedraaid.',
          'Betaal je met crypto, dan heb je 10% korting op het totaalbedrag.',
        ],
      },
      {
        h: 'Veilig betalen',
        ul: [
          `Controleer dat de betaalgegevens uit een e-mail komen van ${EMAIL}.`,
          'Verandert er volgens een bericht van een ander afzender iets aan het rekeningnummer of het crypto-adres? Vertrouw dat niet en mail ons eerst.',
          'Wij vragen je nooit om je bankpas, pincode of inloggegevens van je bank.',
        ],
      },
      {
        h: 'Wanneer is je bestelling definitief?',
        p: ['Zodra we je betaling hebben ontvangen. Tot dat moment geldt je bestelling als een aanvraag. Na ontvangst van je betaling bevestigen we de levertijd per e-mail.'],
      },
      {
        h: 'Vragen over een betaling?',
        p: [`Mail ons met je ordernummer naar ${EMAIL}. Heb je al betaald en wil je weten of de betaling binnen is, vermeld dan de datum en het bedrag erbij.`],
      },
    ],
  },
  {
    slug: 'bezorgen',
    label: 'Bezorgen',
    title: 'Bezorgen: gratis in heel Nederland',
    description: `Bezorging bij ${NAME}: gratis in heel Nederland, 100% rijklaar door een monteur of in de fabrieksdoos. Lees hoe de aflevering verloopt.`,
    intro: 'We bezorgen je e-bike gratis in heel Nederland. Je kiest zelf hoe: 100% rijklaar of in de fabrieksdoos.',
    sections: [
      {
        h: 'Levertijd',
        p: ['De levertijd verschilt per model en per merk. Zodra we je betaling hebben ontvangen bevestigen we de levertijd per e-mail, zodat je precies weet waar je aan toe bent.'],
      },
      {
        h: 'Twee manieren van bezorgen',
        ul: [
          '100% rijklaar thuisbezorgd: de bezorger belt ongeveer 30 minuten van tevoren. Het zadel en het stuur worden op jouw lengte afgesteld en je krijgt uitleg over de boordcomputer en de accu. Dit is inclusief service en kost niets extra.',
          'In de fabrieksdoos: de fiets is voor ongeveer 90% gemonteerd. Het voorwiel, het stuur en de pedalen monteer je zelf.',
        ],
      },
      {
        h: 'Voor de bezorging',
        ul: [
          'Je telefoonnummer is nodig voor de bezorgafspraak, dus vul het goed in bij het afrekenen.',
          'Zorg dat er iemand aanwezig is op het afgesproken moment.',
          'Gewicht en afmetingen van de doos staan per model op de productpagina, onder Bezorging en montage.',
        ],
      },
      {
        h: 'Wat mag je van de bezorger verwachten?',
        p: ['De bezorger belt vlak voor de aankomst, brengt de e-bike naar de afgesproken plek en pakt hem op jouw verzoek uit. Bij een 100% rijklaar geleverde fiets stelt hij het zadel en het stuur op jouw lengte af en laat hij zien hoe de boordcomputer en de accu werken, zodat je direct kunt gaan rijden.'],
      },
      {
        h: 'Na de bezorging',
        ul: [
          'Noteer het framenummer van je fiets en bewaar je factuur. Die heb je nodig voor een verzekering of een garantiemelding.',
          'Laad de accu volgens de handleiding van de fabrikant voordat je de eerste rit maakt.',
          'Heb je een vraag over de afstelling of de bediening? Mail ons gerust.',
        ],
      },
      {
        h: 'Bij ontvangst',
        p: [`Controleer de fiets en de verpakking bij ontvangst. Zie je schade of ontbreekt er iets? Meld het dan zo snel mogelijk per e-mail aan ${EMAIL}, het liefst met foto’s en je ordernummer.`],
      },
      {
        h: 'Speed pedelecs',
        p: ['Een speed pedelec (tot 45 km/u) geldt als bromfiets. Voor het rijden zijn een kenteken, een verzekering, een goedgekeurde helm en minimaal een AM-rijbewijs nodig. Bij een speed pedelec regelen wij de RDW-registratie en het kenteken bij de aflevering.'],
      },
    ],
  },
  {
    slug: 'retourneren',
    label: 'Retourneren en herroepen',
    title: 'Retourneren en herroepen',
    description: `Retourneren bij ${NAME}: 14 dagen bedenktijd voor consumenten, hoe je herroept, hoe je de e-bike terugstuurt en wanneer je het geld terugkrijgt.`,
    intro: 'Koop je als consument online, dan heb je volgens de wet 14 dagen bedenktijd. Hieronder lees je hoe je gebruikmaakt van dat herroepingsrecht.',
    sections: [
      {
        h: '14 dagen bedenktijd',
        p: [
          'Je mag je aankoop binnen 14 dagen na ontvangst van de e-bike zonder opgave van reden herroepen. De termijn start de dag nadat jij, of iemand die jij hebt aangewezen, de fiets heeft ontvangen.',
          'Dit herroepingsrecht geldt voor consumenten, dus voor particuliere kopers. Koop je zakelijk, bijvoorbeeld als bedrijf, dan heb je dit wettelijke recht niet.',
        ],
      },
      {
        h: 'Zo herroep je',
        ol: [
          `Laat ons binnen de 14 dagen duidelijk per e-mail weten dat je de koop herroept. Mail naar ${EMAIL} en vermeld je ordernummer en je naam.`,
          'Je kunt het modelformulier hieronder gebruiken, maar dat hoeft niet.',
          'We bevestigen je melding per e-mail en sturen je het retouradres en de manier van terugsturen.',
        ],
      },
      {
        h: 'Modelformulier voor herroeping',
        p: [`Kopieer deze tekst in een e-mail aan ${EMAIL} en vul de gegevens in:`],
        ul: [
          `Aan: ${NAME}, ${EMAIL}.`,
          'Ik deel u hierbij mee dat ik mijn overeenkomst voor de koop van de volgende e-bike herroep: (merk en model).',
          'Besteld op (datum) en ontvangen op (datum).',
          'Ordernummer, mijn naam en mijn adres.',
          'Datum.',
        ],
      },
      {
        h: 'De e-bike terugsturen',
        ul: [
          'Stuur de fiets binnen 14 dagen nadat je ons hebt laten weten dat je herroept terug.',
          'Stuur de e-bike compleet terug, met alle onderdelen en toebehoren, en bij voorkeur in de originele verpakking.',
          // REVIEW: statutory default is that the consumer pays the direct return costs, provided the trader says so beforehand.
          'De rechtstreekse kosten van het terugsturen zijn voor jouw rekening.',
        ],
      },
      {
        h: 'Gebruik en waardevermindering',
        p: ['Je mag de e-bike uitproberen om te beoordelen of hij bij je past, zoals je dat in een winkel ook zou doen. Gebruik je de fiets verder dan daarvoor nodig is, dan ben je aansprakelijk voor de waardevermindering. Houd de fiets daarom schoon en ongebruikt.'],
      },
      {
        h: 'Je geld terug',
        p: [
          'We betalen het aankoopbedrag, inclusief de standaard bezorgkosten, binnen 14 dagen nadat we je herroeping hebben ontvangen terug. We mogen wachten met terugbetalen tot we de fiets hebben ontvangen, of tot je hebt aangetoond dat je hem hebt teruggestuurd.',
          'We betalen terug via dezelfde betaalmethode als jij gebruikte. Heb je met crypto betaald, dan spreken we met je af hoe de terugbetaling plaatsvindt.',
        ],
      },
      {
        h: 'Een defect of verkeerde e-bike ontvangen?',
        p: ['Is de fiets beschadigd, defect of niet wat je hebt besteld? Mail ons dan direct. Dat is geen herroeping maar een kwestie van garantie en conformiteit; lees daarvoor de pagina Garantie.'],
      },
    ],
  },
  {
    slug: 'garantie',
    label: 'Garantie',
    title: 'Garantie en reparatie',
    description: `Garantie bij ${NAME}: alle e-bikes zijn nieuw en hebben de fabrieksgarantie van de fabrikant. Zo meld je een probleem.`,
    intro: 'Alle e-bikes die we verkopen zijn nieuw en worden geleverd met de fabrieksgarantie van de fabrikant. Hier lees je wat dat voor jou betekent.',
    sections: [
      {
        h: 'Fabrieksgarantie',
        p: [
          'De voorwaarden voor het frame, de accu en de motor verschillen per merk en per model. Ze staan in de documentatie van de fabrikant die bij je e-bike hoort. Op productpagina’s waar de garantieduur bekend is, vind je die onder Fabrieksgarantie en certificering.',
          'Onze e-bikes voldoen aan de norm EN 15194 voor elektrisch ondersteunde fietsen en hebben een CE-markering.',
        ],
      },
      {
        h: 'Je wettelijke rechten',
        p: ['Naast de garantie van de fabrikant heb je als consument de rechten die de wet je geeft. Een product moet voldoen aan wat je er redelijkerwijs van mag verwachten. Die rechten blijven altijd gelden.'],
      },
      {
        h: 'Een probleem melden',
        ol: [
          `Mail ons op ${EMAIL} met je ordernummer, het model en een omschrijving van het probleem.`,
          'Voeg foto’s of een korte video toe. Dat helpt ons om het probleem sneller te beoordelen.',
          'Wij kijken samen met jou en de fabrikant naar de beste oplossing, zoals reparatie of vervanging, en houden je op de hoogte.',
        ],
      },
      {
        h: 'Wat valt er meestal niet onder garantie?',
        p: ['Fabrikanten sluiten doorgaans normale slijtage uit, zoals banden, remblokken, kettingen en kabels, en daarnaast schade door een ongeval, onjuist gebruik, onvoldoende onderhoud of aanpassingen aan de fiets en de motorsoftware. De exacte voorwaarden vind je in het garantiebewijs van de fabrikant.'],
      },
      {
        h: 'Je e-bike registreren',
        p: ['Noteer het framenummer en bewaar je factuur en ordernummer op een veilige plek. Sommige fabrikanten vragen je de fiets te registreren op hun eigen website om de garantie te activeren. Kijk daarvoor in de handleiding of het garantiebewijs van je merk.'],
      },
      {
        h: 'Goed voor je e-bike zorgen',
        ul: [
          'Laad de accu volgens de handleiding van de fabrikant en bewaar hem niet langdurig helemaal leeg.',
          'Laat je fiets regelmatig nakijken door een fietsenmaker.',
          'Gebruik alleen onderdelen en accessoires die geschikt zijn voor je model.',
        ],
      },
    ],
  },
  {
    slug: 'algemene-voorwaarden',
    label: 'Algemene voorwaarden',
    title: 'Algemene voorwaarden',
    description: `De algemene voorwaarden van ${NAME}: aanbod, prijzen, bestelling, betaling, levering, herroepingsrecht, garantie en klachten.`,
    intro: `Deze algemene voorwaarden zijn van toepassing op elke bestelling bij ${NAME}. Laatst bijgewerkt: ${SERVICE_UPDATED}.`,
    sections: [
      {
        h: 'Artikel 1. Wie zijn wij?',
        p: [
          `${NAME}, website ebike-te-koop.nl, e-mail ${EMAIL}.`,
          `Vestigingsadres: ${ADDRESS}.`,
          // REVIEW: add the registered business name if it differs from the shop name.
          'Inschrijving bij de Kamer van Koophandel: 84920194. Btw-nummer: NL863492810B01.',
        ],
      },
      {
        h: 'Artikel 2. Toepasselijkheid',
        p: [
          'Deze voorwaarden gelden voor alle aanbiedingen en overeenkomsten tussen ons en jou als koper, via onze website. Ze zijn bedoeld voor consumenten en voor zakelijke kopers. Waar een bepaling alleen voor consumenten geldt, staat dat erbij.',
          'Bepalingen in deze voorwaarden doen niets af aan de dwingende rechten die de wet je als consument geeft.',
        ],
      },
      {
        h: 'Artikel 3. Aanbod',
        p: [
          'We verkopen nieuwe elektrische fietsen van bekende merken. De omschrijving, de specificaties en de adviesprijzen op de website zijn afkomstig van de fabrikant en kunnen zonder voorafgaande kennisgeving wijzigen.',
          'Foto’s zijn zo goed mogelijk een weergave van het product, maar kleuren en details kunnen afwijken. Kennelijke vergissingen of fouten in het aanbod binden ons niet.',
        ],
      },
      {
        h: 'Artikel 4. Prijzen',
        p: ['Alle prijzen zijn in euro’s en inclusief 21% btw. Bezorging in Nederland is gratis, tenzij we je vóór je bestelling anders laten weten. Betaal je met crypto, dan krijg je 10% korting op het totaalbedrag.'],
      },
      {
        h: 'Artikel 5. Bestelling en overeenkomst',
        p: [
          'Je plaatst een bestelling via de website. Je ontvangt een bevestiging per e-mail met je ordernummer en daarna de betaalgegevens.',
          'Je bestelling is definitief zodra we je betaling hebben ontvangen. Tot die tijd is je bestelling een aanvraag. Na ontvangst van je betaling bevestigen we de levertijd.',
        ],
      },
      {
        h: 'Artikel 6. Betaling',
        p: [
          'Je betaalt vooraf, per bankoverschrijving of met crypto (BTC, USDT of ETH). We sturen je de betaalgegevens per e-mail.',
          'Heb je met crypto betaald, dan moet het juiste bedrag op het juiste adres en via het juiste netwerk bij ons aankomen. Een crypto-betaling kan niet worden teruggedraaid.',
        ],
      },
      {
        h: 'Artikel 7. Levering',
        p: [
          'We bezorgen op het adres dat je bij je bestelling opgeeft. De levertijd bevestigen we per e-mail nadat je betaling is ontvangen. Een genoemde levertijd is een indicatie, tenzij we iets anders met je afspreken.',
          'Je kunt kiezen voor een 100% rijklaar geleverde e-bike of voor levering in de fabrieksdoos, voor ongeveer 90% gemonteerd. Het risico van beschadiging of verlies gaat over op jou zodra je de e-bike hebt ontvangen.',
        ],
      },
      {
        h: 'Artikel 8. Herroepingsrecht voor consumenten',
        p: [
          'Als consument mag je de koop binnen 14 dagen na ontvangst zonder opgave van reden herroepen. Hoe je dat doet, hoe je de fiets terugstuurt en wanneer je het geld terugkrijgt, staat op de pagina Retourneren en herroepen. Die pagina maakt deel uit van deze voorwaarden.',
          'Het herroepingsrecht geldt niet voor kopers die zakelijk bestellen.',
        ],
      },
      {
        h: 'Artikel 9. Garantie en conformiteit',
        p: [
          'Onze e-bikes zijn nieuw en worden geleverd met de fabrieksgarantie van de fabrikant. Daarnaast moet het product voldoen aan de overeenkomst en aan wat je er redelijkerwijs van mag verwachten.',
          'Constateer je een gebrek, meld het dan binnen redelijke tijd nadat je het hebt ontdekt, per e-mail en met je ordernummer. Meer uitleg staat op de pagina Garantie.',
        ],
      },
      {
        h: 'Artikel 10. Klachten',
        p: [`Ben je ergens niet tevreden over? Mail ons dan op ${EMAIL} met een duidelijke omschrijving. We reageren zo snel mogelijk en zoeken met je naar een oplossing.`],
      },
      {
        h: 'Artikel 11. Aansprakelijkheid',
        p: ['We zijn aansprakelijk voor schade voor zover de wet dat voorschrijft. Onze aansprakelijkheid is, voor zover de wet dat toelaat, beperkt tot het bedrag van de betreffende bestelling. Deze beperking geldt niet bij opzet of bewuste roekeloosheid, en niet voor rechten die je als consument op grond van de wet altijd houdt.'],
      },
      {
        h: 'Artikel 12. Toepasselijk recht en geschillen',
        p: [
          'Op onze overeenkomsten is Nederlands recht van toepassing. Komen we er samen niet uit, dan kun je het geschil voorleggen aan de bevoegde rechter. Als consument behoud je daarbij de rechten die de wet je geeft.',
          'We kunnen deze voorwaarden aanpassen. Voor jouw bestelling gelden de voorwaarden zoals die golden op het moment van bestellen.',
        ],
      },
    ],
  },
  {
    slug: 'privacy',
    label: 'Privacy',
    title: 'Privacyverklaring',
    description: `Privacyverklaring van ${NAME}: welke persoonsgegevens we verwerken, waarom, hoe lang we ze bewaren en welke rechten je hebt.`,
    intro: `${NAME} gaat zorgvuldig om met je persoonsgegevens. In deze verklaring lees je welke gegevens we gebruiken en waarom. Laatst bijgewerkt: ${SERVICE_UPDATED}.`,
    sections: [
      {
        h: 'Wie is verantwoordelijk?',
        p: [`${NAME} (ebike-te-koop.nl) is verantwoordelijk voor de verwerking van je persoonsgegevens. Je bereikt ons via ${EMAIL} of op ons vestigingsadres: ${ADDRESS}. Kamer van Koophandel: 84920194.`],
      },
      {
        h: 'Welke gegevens verwerken we?',
        ul: [
          'Bij een bestelling: je voornaam en achternaam, e-mailadres, telefoonnummer, bezorgadres, eventueel een bedrijfsnaam of werkgever, de inhoud van je bestelling, de gekozen betaalmethode en een eventuele opmerking.',
          'Bij een bericht via het contactformulier of per e-mail: je naam, je e-mailadres en wat je ons schrijft.',
          'Gegevens over je betaling, zoals het bedrag, de datum en het betalingskenmerk, voor zover we die nodig hebben om je betaling te koppelen aan je bestelling.',
        ],
      },
      {
        h: 'Waarvoor gebruiken we ze?',
        ul: [
          'Om je bestelling te verwerken, de betaalgegevens te sturen, de e-bike te bezorgen en een bezorgafspraak met je te maken (uitvoering van de overeenkomst).',
          'Om je vragen, klachten en garantiemeldingen af te handelen.',
          'Om te voldoen aan wettelijke verplichtingen, zoals de administratie- en bewaarplicht voor facturen.',
          'Om de website en onze formulieren te beveiligen tegen misbruik en ongewenste berichten (gerechtvaardigd belang).',
        ],
      },
      {
        h: 'Met wie delen we gegevens?',
        p: [
          'Alleen met partijen die we nodig hebben om je bestelling uit te voeren of de website te laten werken, en alleen voor zover dat nodig is.',
          'Dat zijn onder meer de bezorger en monteur die je e-bike afleveren, onze hostingpartij (Vercel), een databaseaanbieder waar bestellingen veilig worden opgeslagen (Upstash) en onze e-maildienst. Met deze partijen maken we afspraken over de zorgvuldige omgang met gegevens.',
          'We verkopen je gegevens niet aan anderen en gebruiken ze niet voor reclame van derden.',
          // REVIEW: confirm the processors listed above and whether any process data outside the EU.
          'Sommige partijen verwerken gegevens mogelijk buiten de Europese Economische Ruimte. In dat geval zorgen we voor passende waarborgen, zoals standaardcontractbepalingen.',
        ],
      },
      {
        h: 'Hoe lang bewaren we gegevens?',
        ul: [
          'Gegevens van je bestelling en factuur bewaren we 7 jaar, omdat we die volgens de fiscale regels moeten bewaren.',
          'Berichten en klachten bewaren we zolang dat nodig is om ze af te handelen en daarna niet langer dan nodig.',
        ],
      },
      {
        h: 'Cookies',
        p: ['Onze website gebruikt geen tracking-, analyse- of advertentiecookies. Meer daarover lees je in de cookieverklaring.'],
      },
      {
        h: 'Jouw rechten',
        ul: [
          'Inzage: je mag vragen welke gegevens we van je hebben.',
          'Correctie: je mag onjuiste gegevens laten aanpassen.',
          'Verwijdering: je mag vragen je gegevens te wissen, behalve voor zover we ze wettelijk moeten bewaren.',
          'Beperking en bezwaar: je mag vragen de verwerking te beperken of er bezwaar tegen maken.',
          'Overdraagbaarheid: je mag vragen je gegevens in een gangbaar formaat te ontvangen.',
        ],
      },
      {
        h: 'Een verzoek of klacht indienen',
        p: [
          `Wil je een van deze rechten gebruiken? Mail ons op ${EMAIL}. We reageren binnen één maand, zoals de wet vereist.`,
          'Ben je het niet eens met de manier waarop we met je gegevens omgaan? Dan kun je een klacht indienen bij de Autoriteit Persoonsgegevens, via autoriteitpersoonsgegevens.nl.',
        ],
      },
      {
        h: 'Beveiliging',
        p: ['We nemen passende technische en organisatorische maatregelen om je gegevens te beschermen, zoals een beveiligde verbinding (https) en beperkte toegang tot bestelgegevens. Vermoed je misbruik of een datalek? Mail ons dan direct.'],
      },
    ],
  },
  {
    slug: 'cookies',
    label: 'Cookies',
    title: 'Cookieverklaring',
    description: `Cookieverklaring van ${NAME}: onze website gebruikt geen tracking-, analyse- of advertentiecookies.`,
    intro: `In deze verklaring lees je hoe ${NAME} omgaat met cookies en vergelijkbare technieken. Laatst bijgewerkt: ${SERVICE_UPDATED}.`,
    sections: [
      {
        h: 'Wat gebruiken we?',
        p: [
          'Onze website gebruikt geen tracking-, analyse- of advertentiecookies en deelt je surfgedrag niet met derden voor reclame.',
          'Voor de werking van de website kan je browser tijdelijk functionele gegevens opslaan, bijvoorbeeld om een stap in je bezoek te onthouden. Die gegevens zijn nodig om de site te laten werken en bevatten geen persoonlijke profielen.',
        ],
      },
      {
        h: 'Waarom geen cookiebanner?',
        p: ['Voor functionele opslag die strikt nodig is om de website te laten werken is geen toestemming nodig. Omdat we geen andere cookies plaatsen, tonen we geen cookiebanner.'],
      },
      {
        h: 'Als dat verandert',
        p: ['Gaan we in de toekomst analyse- of advertentiecookies gebruiken, dan vragen we je vooraf om toestemming en passen we deze verklaring aan.'],
      },
      {
        h: 'Cookies verwijderen of blokkeren',
        p: ['Je kunt in de instellingen van je browser altijd opgeslagen gegevens verwijderen of het opslaan blokkeren. Houd er rekening mee dat sommige onderdelen van de website daarna mogelijk niet meer goed werken.'],
      },
      {
        h: 'Toezicht',
        p: ['Het toezicht op het gebruik van cookies ligt bij de Autoriteit Consument & Markt. Het toezicht op de verwerking van persoonsgegevens ligt bij de Autoriteit Persoonsgegevens.'],
      },
      {
        h: 'Wijzigingen',
        p: ['We kunnen deze verklaring aanpassen, bijvoorbeeld als de website verandert. De datum bovenaan de pagina laat zien wanneer de verklaring het laatst is bijgewerkt.'],
      },
      {
        h: 'Vragen?',
        p: [`Heb je een vraag over deze verklaring? Mail ons op ${EMAIL}. Meer over hoe we met je gegevens omgaan staat in de privacyverklaring.`],
      },
    ],
  },
];

/** Questions shown on the customer-service home page, each pointing at the page that answers it. */
export const SERVICE_FAQ: { q: string; a: string; slug: string }[] = [
  { q: 'Hoe bestel ik een e-bike?', a: 'Kies een model, leg het in de winkelwagen en reken af zonder account. Daarna ontvang je een bevestiging en de betaalgegevens per e-mail.', slug: 'bestellen' },
  { q: 'Hoe kan ik betalen?', a: 'Per bankoverschrijving of met crypto (BTC, USDT of ETH). Met crypto krijg je 10% korting.', slug: 'betalen' },
  { q: 'Wat kost de bezorging?', a: 'Bezorgen is gratis in heel Nederland, rijklaar door een monteur of in de fabrieksdoos.', slug: 'bezorgen' },
  { q: 'Kan ik mijn e-bike terugsturen?', a: 'Als consument heb je 14 dagen bedenktijd na ontvangst. Mail ons dat je herroept en we sturen je het retouradres.', slug: 'retourneren' },
  { q: 'Welke garantie krijg ik?', a: 'Elke e-bike is nieuw en heeft de fabrieksgarantie van de fabrikant. Daarnaast heb je je wettelijke rechten.', slug: 'garantie' },
];

SERVICE_FAQ.push(
  { q: 'Heb ik een account nodig om te bestellen?', a: 'Nee. Je rekent af zonder account en ontvangt je ordernummer per e-mail.', slug: 'bestellen' },
  { q: 'Wanneer wordt mijn e-bike geleverd?', a: 'Dat verschilt per model. Zodra je betaling binnen is, bevestigen we de levertijd per e-mail.', slug: 'bezorgen' },
  { q: 'Welke gegevens gebruiken jullie van mij?', a: 'Alleen wat nodig is voor je bestelling en de bezorging. In de privacyverklaring staat precies welke gegevens, waarom en hoe lang.', slug: 'privacy' },
);

/** Short question-and-answer lists shown at the bottom of each page, answering what customers ask most about that topic. */
export const SERVICE_QA: Record<string, { q: string; a: string }[]> = {
  bestellen: [
    { q: 'Kan ik meerdere e-bikes in één bestelling plaatsen?', a: 'Ja. Je kunt meerdere modellen in je winkelwagen leggen en samen afrekenen. De levertijd kan per model verschillen; die bevestigen we per e-mail.' },
    { q: 'Ik heb geen bevestiging ontvangen. Wat nu?', a: 'Kijk eerst in je spamfolder. Staat de e-mail daar niet, mail ons dan met je naam en het e-mailadres dat je bij het afrekenen hebt gebruikt, dan zoeken we je bestelling op.' },
    { q: 'Hoe weet ik welke framemaat ik nodig heb?', a: 'Op de productpagina zie je welke maten leverbaar zijn. Twijfel je? Mail ons je lichaamslengte en de fiets die je wilt, dan adviseren we je een maat.' },
  ],
  betalen: [
    { q: 'Kan ik in termijnen betalen?', a: 'Nee. We werken met betaling vooraf, per bankoverschrijving of met crypto.' },
    { q: 'Waarom staat er een bedrag in BTC bij de e-bikes?', a: 'Dat is een indicatie, berekend vanuit de prijs in euro’s. Het exacte bedrag voor je bestelling staat in de e-mail met je betaalgegevens.' },
    { q: 'Ik heb een verkeerd bedrag overgemaakt. Wat nu?', a: 'Mail ons direct met je ordernummer en het bedrag dat je hebt betaald. We bekijken samen met je wat de beste oplossing is. Bij crypto kan een betaling niet worden teruggedraaid, dus controleer het bedrag en het adres altijd goed.' },
  ],
  bezorgen: [
    { q: 'Kan ik de e-bike op een ander adres laten bezorgen?', a: 'Ja. Geef bij het afrekenen het adres op waar je de e-bike wilt ontvangen en zorg dat daar iemand aanwezig is.' },
    { q: 'Wat als ik niet thuis ben op het afgesproken moment?', a: 'Neem zo snel mogelijk contact met ons op, dan zoeken we samen een nieuw moment.' },
    { q: 'Bezorgen jullie ook buiten Nederland?', a: 'Onze bezorging is ingericht op Nederland. Woon je in het buitenland, mail ons dan voordat je bestelt.' },
  ],
  retourneren: [
    { q: 'Moet ik een reden opgeven als ik herroep?', a: 'Nee. Binnen de bedenktijd van 14 dagen mag je de koop zonder opgave van reden herroepen.' },
    { q: 'Krijg ik de bezorgkosten terug?', a: 'Onze standaardbezorging is gratis, dus er zijn geen bezorgkosten om terug te betalen.' },
    { q: 'Kan ik de e-bike nog terugsturen als hij al is afgesteld of gemonteerd?', a: 'Ja, een normale montage en afstelling is geen probleem. Gebruik de fiets daarna alleen zoals nodig is om hem te beoordelen, en houd hem schoon en compleet.' },
  ],
  garantie: [
    { q: 'Hoe lang is de garantie?', a: 'Dat verschilt per merk en per onderdeel. Veel fabrikanten geven op het frame een andere garantietermijn dan op de accu of de motor. De exacte termijnen staan in het garantiebewijs van de fabrikant.' },
    { q: 'Valt de accu onder de garantie?', a: 'De accu valt doorgaans onder de fabrieksgarantie, met eigen voorwaarden, bijvoorbeeld over het aantal laadcycli of de resterende capaciteit.' },
    { q: 'Wat heb ik nodig voor een garantiemelding?', a: 'Bewaar je ordernummer en je factuur. Die heb je nodig als bewijs van aankoop. Een foto of video van het probleem helpt om de melding snel te beoordelen.' },
  ],
  cookies: [
    { q: 'Wat zijn cookies?', a: 'Cookies zijn kleine bestanden die een website op je apparaat kan opslaan, bijvoorbeeld om je voorkeuren te onthouden of om je surfgedrag te volgen. Wij gebruiken geen cookies om je te volgen.' },
    { q: 'Welke technische gegevens ontvangt onze hostingpartij?', a: 'Elke website ontvangt technische gegevens als je pagina’s opent, zoals je IP-adres en het type browser. Onze hostingpartij kan die tijdelijk in serverlogs bewaren voor beveiliging en storingsanalyse.' },
    { q: 'Laden jullie scripts van advertentie- of analysepartijen?', a: 'Nee. We laden geen scripts van advertentie- of analysepartijen op onze website.' },
  ],
};

export const serviceBySlug = (slug: string) => SERVICE_PAGES.find((p) => p.slug === slug);
export const SERVICE_PATHS = ['/klantenservice', ...SERVICE_PAGES.map((p) => `/klantenservice/${p.slug}`)];
