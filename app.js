const productListVersion='2026-06-24-tshirt-list-v2';

// 🔥 Firebase-Sync
// Trage hier deine Firebase-Konfiguration ein. Du findest sie in Firebase:
// Projekteinstellungen → Allgemein → Deine Apps → Web-App → firebaseConfig
const firebaseConfig={
  apiKey:'HIER_EINFÜGEN',
  authDomain:'HIER_EINFÜGEN',
  projectId:'HIER_EINFÜGEN',
  storageBucket:'HIER_EINFÜGEN',
  messagingSenderId:'HIER_EINFÜGEN',
  appId:'HIER_EINFÜGEN'
};

const firebaseDocId='listing-generator-main';
let db=null;
let firebaseReady=false;
let unsubscribeFirebase=null;
let isApplyingRemote=false;
let saveTimer=null;

function hasFirebaseConfig(){
  return firebaseConfig.apiKey&&firebaseConfig.apiKey!=='HIER_EINFÜGEN'&&firebaseConfig.projectId&&firebaseConfig.projectId!=='HIER_EINFÜGEN';
}

function setSyncStatus(text,type='neutral'){
  const el=byId('sync-status');
  if(!el)return;
  el.textContent=text;
  el.className=`sync-status ${type}`;
}

async function initFirebaseSync(){
  if(!window.firebase){setSyncStatus('Firebase SDK fehlt – lokal gespeichert','warn');return;}
  if(!hasFirebaseConfig()){setSyncStatus('Firebase Config fehlt – lokal gespeichert','warn');return;}
  try{
    if(!firebase.apps.length)firebase.initializeApp(firebaseConfig);
    db=firebase.firestore();
    await firebase.auth().signInAnonymously();
    firebaseReady=true;
    setSyncStatus('Firebase verbunden – Sync aktiv','ok');
    listenToCloudData();
    await saveAllToCloudDebounced(true);
  }catch(error){
    console.error('Firebase Fehler:',error);
    setSyncStatus('Firebase Fehler – lokal gespeichert','error');
  }
}

function cloudDoc(){
  return db.collection('listingGenerator').doc(firebaseDocId);
}

function getTemplateData(){
  return {
    start:byId('template-start')?.value||'',
    end:byId('template-end')?.value||''
  };
}

function applyTemplateData(data={}){
  if(byId('template-start'))byId('template-start').value=data.start||'';
  if(byId('template-end'))byId('template-end').value=data.end||'';
}

function listenToCloudData(){
  if(!firebaseReady)return;
  if(unsubscribeFirebase)unsubscribeFirebase();
  unsubscribeFirebase=cloudDoc().onSnapshot(snapshot=>{
    if(!snapshot.exists)return;
    const data=snapshot.data()||{};
    isApplyingRemote=true;
    if(Array.isArray(data.products)&&data.products.length){
      products=data.products.map(normalizeProduct).filter(p=>p.name);
      localStorage.setItem('ph_listing_products',JSON.stringify(products));
      localStorage.setItem('ph_listing_products_version',productListVersion);
      refreshProductSelect(byId('product')?.value);
      renderProductManager(byId('admin-product')?.value);
    }
    if(data.templates){
      applyTemplateData(data.templates);
      localStorage.setItem('ph_listing_templates',JSON.stringify(data.templates));
    }
    isApplyingRemote=false;
    onProductChange();
    setSyncStatus('Synchronisiert','ok');
  },error=>{
    console.error('Firebase Snapshot Fehler:',error);
    setSyncStatus('Sync-Fehler – lokal gespeichert','error');
  });
}

async function saveAllToCloudDebounced(immediate=false){
  if(isApplyingRemote||!firebaseReady)return;
  clearTimeout(saveTimer);
  const run=async()=>{
    try{
      await cloudDoc().set({
        productListVersion,
        products,
        templates:getTemplateData(),
        updatedAt:firebase.firestore.FieldValue.serverTimestamp()
      },{merge:true});
      setSyncStatus('Gespeichert & synchronisiert','ok');
    }catch(error){
      console.error('Firebase Speichern Fehler:',error);
      setSyncStatus('Cloud-Speichern fehlgeschlagen – lokal gespeichert','error');
    }
  };
  if(immediate)return run();
  saveTimer=setTimeout(run,450);
}
const defaultProducts=[
  {name:'Hose',type:'Hose',theme:['Sommerhose','blau weiß gestreift','Stockholm Style','Old Money Style'],tags:['#hose','#sommerhose','#oldmoneystyle','#stockholmstyle','#gestreift','#sommeroutfit']},
  {name:'Yacht Club Saint Tropez - Weiß mit navyblauem Design',type:'T-Shirt',theme:['Yacht Club','Saint Tropez','Riviera','Sommer Look'],tags:['#tshirt','#yachtclub','#sainttropez','#rivierastyle','#sommeroutfit']},
  {name:'Yacht Club Saint Tropez - Navyblau mit weißem Design',type:'T-Shirt',theme:['Yacht Club','Saint Tropez','navy','maritim'],tags:['#tshirt','#yachtclub','#sainttropez','#navy','#maritim']},
  {name:'Yacht Club Monaco - Weiß mit navyblauem Design',type:'T-Shirt',theme:['Yacht Club','Monaco','Riviera','Old Money'],tags:['#tshirt','#yachtclub','#monaco','#oldmoneystyle','#rivierastyle']},
  {name:'Yacht Club Monaco - Navyblau mit weißem Design',type:'T-Shirt',theme:['Yacht Club','Monaco','navy','Riviera'],tags:['#tshirt','#yachtclub','#monaco','#navy','#sommerlook']},
  {name:"Yacht Club Cap d'Antibes - Weiß mit schwarz/gold Design",type:'T-Shirt',theme:["Cap d'Antibes",'Yacht Club','Riviera','Old Money'],tags:['#tshirt','#yachtclub','#capdantibes','#oldmoneystyle','#rivierastyle']},
  {name:'Monaco Heliport T-Shirt - Weiß mit navyblauem Design',type:'T-Shirt',theme:['Monaco Heliport','Monaco','Riviera','Sommer Look'],tags:['#tshirt','#monaco','#heliport','#rivierastyle','#sommeroutfit']},
  {name:'Monochrome T-Shirt - Navyblau mit weißem Design',type:'T-Shirt',theme:['Monochrome','navy','minimal','clean'],tags:['#tshirt','#monochrome','#navy','#minimal','#streetwear']},
  {name:'Dolce Vita Portofino Boat Club T-Shirt - Weiß mit navyblauem Design',type:'T-Shirt',theme:['Dolce Vita','Portofino','Boat Club','Riviera'],tags:['#tshirt','#dolcevita','#portofino','#boatclub','#rivierastyle']},
  {name:'Portofino Dolce Vita Boat Club - Navyblau mit weißem Design',type:'T-Shirt',theme:['Portofino','Dolce Vita','Boat Club','navy'],tags:['#tshirt','#portofino','#dolcevita','#boatclub','#navy']},
  {name:'Sonstiges',type:'Artikel',theme:['clean','modern','casual','Outfit'],tags:['#vinted','#outfit','#fashion','#style']}
];
let products=loadProducts();

const titlePatterns=[
  p=>`${p.name}${p.size?` Gr. ${p.size}`:''}${p.color?` ${p.color}`:''} - ${pick(p.theme)}`,
  p=>`${pick(p.theme)} ${p.type}${p.size?` Größe ${p.size}`:''}${p.color?` in ${p.color}`:''}`,
  p=>`${p.name} | ${p.condition}${p.size?` | Gr. ${p.size}`:''}`,
  p=>`${p.type} ${pick(p.theme)}${p.color?` ${p.color}`:''}${p.size?` Gr. ${p.size}`:''}`
];
const openers=[
  p=>`Verkaufe hier ${article(p.type)} ${p.name}.`,
  p=>`${p.name} in einem ${p.style}en Look, ideal für Alltag, Urlaub oder ein schlichtes Outfit.`,
  p=>`Schöner ${p.type} mit ${pick(p.theme)}-Vibe und sehr gut kombinierbarem Stil.`,
  p=>`Zum Verkauf steht ${p.name}, perfekt für alle, die einen cleanen und modernen Look mögen.`
];
const detailLines=[
  p=>`Zustand: ${p.condition}.`,
  p=>`${p.size?`Größe: ${p.size}.`:''}${p.color?` Farbe: ${p.color}.`:''}`.trim(),
  p=>p.details?`Details: ${p.details}.`:`Der Artikel lässt sich sehr einfach kombinieren und wirkt auf Bildern hochwertig.`,
  p=>`Passt gut zu Jeans, Shorts, Sneakern oder einem entspannten Sommer-Outfit.`,
  p=>`Ich achte auf schnellen Versand und ordentliche Verpackung.`
];
const closers=[
  'Bei Fragen gerne schreiben.',
  'Schau gerne auch bei meinen anderen Artikeln vorbei.',
  'Privatverkauf, daher keine Rücknahme.',
  'Perfekt, wenn du ein unkompliziertes Vinted Outfit suchst.'
];

const hoseRequired={
  titleBase:'Blau-weiß gestreifte Sommerhose',
  website:'https://becker-boutique.com/products/elko-loose-fit-gestreift-herren-sommerhose',
  style:'Stockholm Style / Old Money Look',
  fit:'Baggy Fit',
  fabric:'Der Stoff fällt leicht und dünn aus, was sie perfekt für warme Sommertage macht.',
  reason:'nur einmal zur Abi-Mottowoche getragen'
};

const hoseSizeData={
  S:{length:'ca. 100 cm',waist:'ca. 37 cm (sehr elastisch)',compare:'Ich bin 1,76 m groß und mir passt sie sehr gut'},
  M:{length:'ca. 103 cm',waist:'ca. 38 cm (sehr elastisch)',compare:'Ich bin 1,80 m groß und mir passt sie sehr gut'},
  L:{length:'ca. 104 cm',waist:'ca. 39 cm (sehr elastisch)',compare:'Ich bin 1,84 m groß und mir passt sie sehr gut'},
  XL:{length:'ca. 106 cm',waist:'ca. 40 cm (sehr elastisch)',compare:'Ich bin 1,88 m groß und mir passt sie sehr gut'}
};

const tshirtSizeData={
  S:{length:'68 cm',width:'49 cm'},
  M:{length:'70 cm',width:'53 cm'},
  L:{length:'73 cm',width:'55 cm'}
};

const hoseOpeners=[
  'Verkauft wird diese schöne blau-weiß gestreifte Herren-Sommerhose',
  'Ich verkaufe diese blau-weiß gestreifte Herren-Sommerhose',
  'Zum Verkauf steht diese schöne blau-weiß gestreifte Sommerhose',
  'Angeboten wird diese blau-weiß gestreifte Herren-Sommerhose'
];

const hoseConditionLines=[
  'Ich habe sie nur einmal zur Abi-Mottowoche getragen - sie ist daher noch in einem sehr guten, fast neuwertigen Zustand.',
  'Sie wurde nur einmal zur Abi-Mottowoche getragen und ist deshalb in einem sehr guten, nahezu neuwertigen Zustand.',
  'Getragen wurde sie lediglich einmal bei der Abi-Mottowoche, daher ist sie noch sehr gepflegt und fast wie neu.',
  'Die Hose kam nur einmal während der Abi-Mottowoche zum Einsatz und befindet sich daher in einem sehr guten Zustand.'
];

const hoseSummerLines=[
  'Der Stoff fällt leicht und dünn aus, was sie perfekt für warme Sommertage macht.',
  'Der leichte und dünne Stoff macht sie ideal für Sommer, Urlaub und warme Tage.',
  'Sie trägt sich angenehm luftig, da der Stoff sehr leicht und dünn ausfällt.',
  'Durch den dünnen Stoff eignet sich die Hose besonders gut für warme Sommertage.'
];

const hoseStyleLines=[
  'Die dunkel blau-weißen Streifen geben der Hose einen tollen Stockholm Style / Old Money Look.',
  'Durch die dunkel blau-weißen Streifen wirkt sie clean und passt perfekt zum Stockholm Style / Old Money Look.',
  'Die blau-weißen Streifen sorgen für einen hochwertigen Old Money Style und einen sommerlichen Stockholm Look.',
  'Optisch passt sie sehr gut zu einem Stockholm Style, Old Money Style oder sommerlichen Herren-Look.'
];

const hoseHashtags=[
  '#sommerhose','#herrenhose','#loosefitpants','#oldmoneystyle','#oldmoney',
  '#stockholmstyle','#gestreifthose','#blauweiss','#sommerlook','#sommeroutfit',
  '#herrenmode','#streetstyle','#mensfashion','#abimottowoche','#leichterhose',
  '#beckerboutique','#preppy','#nauticalstyle','#boatstyle'
];

const capRequired={
  titleBase:"Weißes Maison Rivage Yacht Club Cap d'Antibes T-Shirt",
  design:"Maison Rivage Yacht Club Cap d'Antibes Design",
  color:'Weiß',
  designColor:'gold/schwarzem Design',
  material:'100 % Baumwolle',
  weight:'215 GSM Heavy Cotton',
  print:'Selbst bedruckt',
  style:'Old Money / Riviera-Vibe'
};

const capOpeners=[
  "Verkauft wird dieses stilvolle weiße T-Shirt im Maison Rivage Yacht Club Cap d'Antibes Design",
  "Ich verkaufe dieses weiße Maison Rivage Yacht Club Cap d'Antibes T-Shirt",
  "Zum Verkauf steht dieses stilvolle weiße T-Shirt mit Maison Rivage Yacht Club Cap d'Antibes Design",
  "Angeboten wird dieses weiße Cap d'Antibes T-Shirt im Maison Rivage Yacht Club Look"
];

const capLookLines=[
  'Das maritime Design gibt dem Shirt einen eleganten Old Money / Riviera-Vibe.',
  'Der maritime Look wirkt clean, hochwertig und passt perfekt zum Old Money / Riviera Style.',
  'Das Yacht Club Design sorgt für einen edlen Riviera-Vibe mit Old Money Charakter.',
  'Optisch geht das Shirt klar in Richtung Old Money, Riviera Style und sommerlicher Yacht Club Look.'
];

const capFitLines=[
  'Es lässt sich super zu Chinos, Shorts oder einer leichten Sommerhose kombinieren.',
  'Kombinieren kann man es sehr gut mit Shorts, Chinos oder einer lockeren Sommerhose.',
  'Perfekt zu Chinos, hellen Shorts oder einer leichten Sommerhose für warme Tage.',
  'Der Look passt besonders gut zu Sommerhose, Shorts, Chinos oder cleanen Sneakern.'
];

const capHashtags=[
  '#tshirt','#herrenshirt','#heavycotton','#215gsm','#oldmoneystyle','#oldmoney',
  '#yachtclub','#capdantibes','#maisonrivage','#rivierastyle','#nauticalstyle',
  '#maritim','#sommerlook','#sommeroutfit','#herrenmode','#casualstyle',
  '#streetwear','#weißestshirt','#customshirt','#einzelstück','#preppy',
  '#frenchriviera','#luxurystyle','#vintedfashion'
];

let variant=1;

function pick(arr){return arr[Math.floor(Math.random()*arr.length)]}
function article(type){return ['Armband','Bundle','Artikel'].includes(type)?'ein':'ein schönes'}
function clean(value){return String(value||'').trim()}
function byId(id){return document.getElementById(id)}
function productKey(name){return clean(name).toLowerCase()}

function normalizeProduct(p){
  const name=clean(p.name);
  const type=p.type||'T-Shirt';
  const theme=Array.isArray(p.theme)?p.theme:clean(p.theme).split(',').map(x=>clean(x)).filter(Boolean);
  const tags=Array.isArray(p.tags)?p.tags:clean(p.tags).split(/\s+/).filter(Boolean);
  return {
    name,
    type,
    color:clean(p.color),
    theme:theme.length?theme:['Riviera','Sommer Look','Old Money'],
    tags:tags.length?tags:['#tshirt','#sommeroutfit','#herrenmode']
  };
}

function loadProducts(){
  try{
    if(localStorage.getItem('ph_listing_products_version')!==productListVersion)return defaultProducts.map(normalizeProduct);
    const saved=JSON.parse(localStorage.getItem('ph_listing_products')||'null');
    if(Array.isArray(saved)&&saved.length)return saved.map(normalizeProduct).filter(p=>p.name);
  }catch{}
  return defaultProducts.map(normalizeProduct);
}

function saveProducts(){
  localStorage.setItem('ph_listing_products',JSON.stringify(products));
  localStorage.setItem('ph_listing_products_version',productListVersion);
  saveAllToCloudDebounced();
}

function init(){
  refreshProductSelect();
  loadTemplates();
  renderProductManager();
  onProductChange();
  initFirebaseSync();
}

function refreshProductSelect(selected=byId('product')?.value){
  byId('product').innerHTML=products.map(p=>`<option value="${p.name}">${p.name}</option>`).join('');
  if(selected&&products.some(p=>p.name===selected))byId('product').value=selected;
}

function currentProduct(){
  const base=products.find(p=>p.name===byId('product').value)||products[0];
  const extraKeywords=clean(byId('keywords').value).split(',').map(x=>clean(x)).filter(Boolean);
  return {
    ...base,
    size:clean(byId('size').value),
    color:clean(byId('color').value),
    condition:byId('condition').value,
    style:byId('style').value,
    details:clean(byId('details').value),
    theme:[...base.theme,...extraKeywords],
    tags:[...base.tags,...extraKeywords.map(x=>'#'+x.toLowerCase().replace(/\s+/g,''))]
  };
}

function productColor(product){
  if(product.name==='Hose')return 'blau-weiß gestreift';
  const stored=products.find(p=>p.name===product.name);
  return clean(stored?.color)||tshirtColorForProduct(product.name)||clean(product.color)||'';
}

function setSizeOptions(kind){
  const select=byId('size');
  const current=select.value;
  const sizes=kind==='hose'?['S','M','L','XL']:kind==='tshirt'?['S','M','L']:['S','M','L','XL'];
  select.innerHTML='<option value="">Wählen...</option>'+sizes.map(s=>`<option>${s}</option>`).join('');
  select.value=sizes.includes(current)?current:'';
}

function tshirtColorForProduct(name){
  if(name.includes("Cap d'Antibes"))return 'Weiß mit schwarz/gold Design';
  const lower=name.toLowerCase();
  if(lower.includes('navyblau mit weiß'))return 'Navyblau mit weißem Design';
  if(lower.includes('weiß mit navy'))return 'Weiß mit navyblauem Design';
  if(lower.includes('schwarz'))return 'Schwarz mit weißem Design';
  if(lower.includes('navy')||lower.includes('navyblau'))return 'Navyblau mit weißem Design';
  if(name.includes('T-Shirt')||name.includes('Yacht Club'))return 'Weiß mit navyblauem Design';
  return '';
}

function cleanTshirtTitleName(name){
  const cleanName=name
    .replace(/\s+-\s+(Weiß|Navyblau|Schwarz).*/i,'')
    .replace(/\s*T-Shirt\s*/i,' ')
    .replace(/\s+/g,' ')
    .trim();
  return cleanName.includes('Maison Rivage')?cleanName:`Maison Rivage ${cleanName}`;
}

function onProductChange(){
  const p=currentProduct();
  if(p.name==='Hose'){
    setSizeOptions('hose');
    if(!byId('size').value)byId('size').value='M';
    byId('color').value='blau-weiß gestreift';
    byId('condition').value='Sehr guter Zustand';
    byId('style').value='Stockholm Style';
  }
  if(p.name.includes("Cap d'Antibes")){
    setSizeOptions('tshirt');
    if(!byId('size').value)byId('size').value='L';
    byId('color').value=productColor(p);
    byId('condition').value='Neu und ungetragen';
    byId('style').value='Old Money Style';
  }
  if(p.type==='T-Shirt'&&!p.name.includes("Cap d'Antibes")){
    setSizeOptions('tshirt');
    if(!['S','M','L'].includes(byId('size').value))byId('size').value='L';
    byId('color').value=productColor(p);
  }
  if(p.type!=='T-Shirt'&&p.name!=='Hose')setSizeOptions('all');
  generateListing();
}

function generateListing(manual=false){
  if(manual)variant++;
  const p=currentProduct();
  if(p.name==='Hose'){
    generateHoseListing(p);
    return;
  }
  if(p.name.includes("Cap d'Antibes")){
    generateCapListing(p);
    return;
  }
  if(p.type==='T-Shirt'){
    generateTshirtListing(p);
    return;
  }
  const start=clean(byId('template-start').value);
  const end=clean(byId('template-end').value);
  const title=titlePatterns[variant%titlePatterns.length](p).replace(/\s+/g,' ').trim().slice(0,78);
  const lines=[
    start||openers[variant%openers.length](p),
    '',
    ...detailLines.map(fn=>fn(p)).filter(Boolean),
    '',
    pick(closers),
    end?`\n${end}`:'',
    '',
    [...new Set(p.tags)].slice(0,9).join(' ')
  ].filter(x=>x!==null);
  byId('title').value=title;
  byId('description').value=lines.join('\n').replace(/\n{3,}/g,'\n\n').trim();
  byId('variant-label').textContent=`Variante ${variant}`;
}

function generateTshirtListing(p){
  const size=(p.size||'L').toUpperCase();
  const measure=tshirtSizeData[size]||tshirtSizeData.L;
  const color=productColor(p)||p.color||'Weiß';
  const titleName=cleanTshirtTitleName(p.name);
  const titleVariants=[
    `${titleName} T-Shirt | Größe ${size} | Heavy Cotton | Old Money Style`,
    `${titleName} T-Shirt | Gr. ${size} | 215 GSM | Riviera Style`,
    `${titleName} T-Shirt | Größe ${size} | Yacht Club Style`,
    `${titleName} T-Shirt | ${size} | Heavy Cotton | Maritimer Look`
  ];
  const title=titleVariants[variant%titleVariants.length];
  const tags=[...new Set([...p.tags,'#heavycotton','#215gsm','#oldmoneystyle','#sommeroutfit','#herrenmode','#streetwear','#customshirt'])].join(' ');
  const introOptions=[
    `Ich verkaufe dieses Maison Rivage ${cleanTshirtTitleName(p.name).replace(/^Maison Rivage\s+/,'')} T-Shirt in Größe ${size}.`,
    `Ich biete hier dieses Maison Rivage T-Shirt in Größe ${size} an.`,
    `Verkauft wird dieses Maison Rivage ${cleanTshirtTitleName(p.name).replace(/^Maison Rivage\s+/,'')} Shirt in Größe ${size}.`,
    `Ich verkaufe hier ein Maison Rivage T-Shirt in Größe ${size}.`
  ];
  const lookOptions=[
    'Das Shirt hat einen cleanen, sommerlichen Look und passt sehr gut zu Chinos, Shorts oder einer leichten Sommerhose.',
    'Der Look wirkt hochwertig, maritim und lässt sich sehr gut im Sommer kombinieren.',
    'Vom Stil her passt es gut zu Riviera, Old Money, Streetwear oder einem cleanen Casual-Outfit.',
    'Es ist ideal für warme Tage und lässt sich einfach mit Shorts, Jeans oder Sommerhose tragen.'
  ];
  const materialLine='Material: 100 % Baumwolle, 215 GSM Heavy Cotton - angenehm schwer und hochwertig im Griff.';
  const details=[
    `- Größe: ${size}`,
    `- Länge: ${measure.length}`,
    `- Breite: ${measure.width}`,
    `- Farbe / Design: ${color}`,
    '- Marke: Maison Rivage',
    '- Material: 100 % Baumwolle',
    '- 215 GSM Heavy Cotton',
    '- Selbst bedruckt'
  ].join('\n');
  const shipping='📦 Versand möglich - in der Regel innerhalb von 24 Stunden.';
  const contact='Bei Fragen oder Interesse einfach melden, ich antworte schnell! 😊';
  const layouts=[
    ['Hallo! 👋','',introOptions[variant%introOptions.length],lookOptions[variant%lookOptions.length],'',`Farbe / Design: ${color}.`,materialLine,'Marke: Maison Rivage.','Selbst bedruckt.','','Details:',details,'',shipping,'',contact,'','Viele Grüße','',tags],
    ['Hallo! 👋','',introOptions[variant%introOptions.length],'',`Die wichtigsten Details: Maison Rivage, Größe ${size}, Länge ${measure.length}, Breite ${measure.width}.`,`${color}. ${materialLine} Selbst bedruckt.`,'',lookOptions[variant%lookOptions.length],'',shipping,contact,'','Viele Grüße','',tags],
    ['Hallo! 👋','',introOptions[variant%introOptions.length],lookOptions[variant%lookOptions.length],'','Maße & Material:','Marke: Maison Rivage',`Größe: ${size}`,`Länge: ${measure.length}`,`Breite: ${measure.width}`,`Farbe / Design: ${color}`,'100 % Baumwolle','215 GSM Heavy Cotton','Selbst bedruckt','',shipping,'',contact,'','Viele Grüße','',tags],
    ['Hallo! 👋','',`${introOptions[variant%introOptions.length]} ${lookOptions[variant%lookOptions.length]}`,'',`Details: Maison Rivage, Größe ${size}, Länge ${measure.length}, Breite ${measure.width}, ${color}.`,`${materialLine} Das Shirt ist selbst bedruckt.`,'',shipping,'',contact,'','Viele Grüße','',tags]
  ];
  byId('title').value=title;
  byId('description').value=layouts[variant%layouts.length].join('\n');
  byId('variant-label').textContent=`T-Shirt Variante ${variant}`;
}

function generateHoseListing(p){
  const size=(p.size||'M').toUpperCase();
  const measure=hoseSizeData[size]||hoseSizeData.M;
  const titleVariants=[
    `${hoseRequired.titleBase} | Größe ${size} | Baggy Fit | Old Money Style`,
    `${hoseRequired.titleBase} | Gr. ${size} | Stockholm Style | Sommerhose`,
    `${hoseRequired.titleBase} | Größe ${size} | Loose Fit Pants`,
    `${hoseRequired.titleBase} | ${size} | Baggy Fit | Stockholm / Old Money`
  ];
  const title=titleVariants[variant%titleVariants.length];
  const hashtags=hoseHashtags.join(' ');
  const intro=`${hoseOpeners[variant%hoseOpeners.length]} in Größe ${size}. ${hoseConditionLines[variant%hoseConditionLines.length]}`;
  const material=`${hoseSummerLines[variant%hoseSummerLines.length]} ${hoseStyleLines[variant%hoseStyleLines.length]}`;
  const measureBlock=[
    `- Größe: ${size}`,
    `- Länge: ${measure.length}`,
    `- Bundweite: ${measure.waist}`,
    `- ${measure.compare}`
  ].join('\n');
  const linkBlock=`Gekauft wurde sie bei Becker Boutique:\n${hoseRequired.website}`;
  const shipping='📦 Versand erfolgt in der Regel innerhalb von 24 Stunden.';
  const contact='Bei Interesse oder Fragen einfach melden - ich freue mich! 😊';
  const layouts=[
    [
      'Hallo! 👋','',
      intro,'',
      material,'',
      'Maße:',
      measureBlock,'',
      linkBlock,'',
      shipping,'',
      contact,'',
      'Viele Grüße','',
      hashtags
    ],
    [
      'Hallo! 👋','',
      intro,'',
      'Die wichtigsten Daten auf einen Blick:',
      `Größe ${size} | Länge ${measure.length} | Bundweite ${measure.waist}`,
      measure.compare,'',
      material,'',
      linkBlock,'',
      `${shipping} ${contact}`,'',
      'Viele Grüße','',
      hashtags
    ],
    [
      'Hallo! 👋','',
      intro,'',
      linkBlock,'',
      material,'',
      'Zur Passform / Maße:',
      `Größe: ${size}`,
      `Länge: ${measure.length}`,
      `Bundweite: ${measure.waist}`,
      measure.compare,'',
      shipping,
      contact,'',
      'Viele Grüße','',
      hashtags
    ],
    [
      'Hallo! 👋','',
      `${intro} Besonders schön ist der leichte ${hoseRequired.fit}, der lässig sitzt und trotzdem clean wirkt.`,'',
      material,'',
      `Maße & Vergleich: Größe ${size}, Länge ${measure.length}, Bundweite ${measure.waist}. ${measure.compare}.`,'',
      linkBlock,'',
      shipping,'',
      contact,'',
      'Viele Grüße','',
      hashtags
    ]
  ];
  const text=layouts[variant%layouts.length].join('\n');
  byId('title').value=title;
  byId('description').value=text;
  byId('variant-label').textContent=`Hose Variante ${variant}`;
}

function generateCapListing(p){
  const size=(p.size||'L').toUpperCase();
  const measure=tshirtSizeData[size]||tshirtSizeData.L;
  const titleVariants=[
    `${capRequired.titleBase} | Größe ${size} | Heavy Cotton | Old Money Style`,
    `${capRequired.titleBase} | Gr. ${size} | 215 GSM | Riviera Style`,
    `${capRequired.titleBase} | Größe ${size} | Yacht Club Look`,
    `${capRequired.titleBase} | ${size} | Maison Rivage | Heavy Cotton`
  ];
  const title=titleVariants[variant%titleVariants.length];
  const hashtags=capHashtags.join(' ');
  const intro=`${capOpeners[variant%capOpeners.length]} - perfekt für den Sommer, sowohl vom Fit als auch vom Look her.`;
  const styleLine=`${capLookLines[variant%capLookLines.length]} ${capFitLines[variant%capFitLines.length]}`;
  const detailBlock=[
    `- Größe: ${size}`,
    `- Länge: ${measure.length}`,
    `- Breite: ${measure.width}`,
    `- Farbe: ${tshirtColorForProduct(p.name)}`,
    `- Material: ${capRequired.material}`,
    `- ${capRequired.weight} - angenehm schwer und hochwertig im Griff`,
    `- ${capRequired.print}`
  ].join('\n');
  const shipping='📦 Versand möglich - in der Regel innerhalb von 24 Stunden.';
  const contact='Bei Fragen oder Interesse einfach melden, ich antworte schnell! 😊';
  const layouts=[
    [
      'Hallo! 👋','',
      intro,'',
      styleLine,'',
      'Details:',
      detailBlock,'',
      shipping,'',
      contact,'',
      'Viele Grüße','',
      hashtags
    ],
    [
      'Hallo! 👋','',
      intro,'',
      'Die wichtigsten Details:',
      `Größe ${size} | Länge ${measure.length} | Breite ${measure.width}`,
      `${capRequired.color}, ${capRequired.material}, ${capRequired.weight}`,
      capRequired.print,'',
      styleLine,'',
      `${shipping} ${contact}`,'',
      'Viele Grüße','',
      hashtags
    ],
    [
      'Hallo! 👋','',
      `${intro} ${styleLine}`,'',
      'Maße & Material:',
      `Größe: ${size}`,
      `Länge: ${measure.length}`,
      `Breite: ${measure.width}`,
      `Farbe: ${tshirtColorForProduct(p.name)}`,
      `Material: ${capRequired.material}`,
      `${capRequired.weight} - angenehm schwer und hochwertig im Griff`,
      capRequired.print,'',
      shipping,
      contact,'',
      'Viele Grüße','',
      hashtags
    ],
    [
      'Hallo! 👋','',
      `Verkaufe ein weißes Maison Rivage Shirt in Größe ${size} mit Cap d'Antibes / Yacht Club Design.`,'',
      styleLine,
      `Der Stoff besteht aus ${capRequired.material}; mit ${capRequired.weight} fühlt sich das Shirt angenehm schwer und hochwertig an.`,'',
      `Details: Größe ${size}, Länge ${measure.length}, Breite ${measure.width}, Farbe ${tshirtColorForProduct(p.name)}, ${capRequired.print}.`,'',
      shipping,'',
      contact,'',
      'Viele Grüße','',
      hashtags
    ]
  ];
  byId('title').value=title;
  byId('description').value=layouts[variant%layouts.length].join('\n');
  byId('variant-label').textContent=`T-Shirt Variante ${variant}`;
}

async function copyText(text){
  try{
    await navigator.clipboard.writeText(text);
  }catch{
    const area=document.createElement('textarea');
    area.value=text;
    area.style.position='fixed';
    area.style.left='-9999px';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }
  toast('Kopiert');
}
function copyField(id){copyText(byId(id).value)}
function copyAll(){copyText(`${byId('title').value}\n\n${byId('description').value}`)}

function saveTemplates(){
  localStorage.setItem('ph_listing_templates',JSON.stringify(getTemplateData()));
  saveAllToCloudDebounced();
  toast('Muster gespeichert');
  generateListing(true);
}
function loadTemplates(){
  const data=JSON.parse(localStorage.getItem('ph_listing_templates')||'{}');
  byId('template-start').value=data.start||'';
  byId('template-end').value=data.end||'';
}
function clearTemplates(){
  byId('template-start').value='';
  byId('template-end').value='';
  saveTemplates();
}

function renderProductManager(selected=byId('admin-product')?.value){
  const select=byId('admin-product');
  if(!select)return;
  select.innerHTML=products.map(p=>`<option value="${p.name}">${p.name}</option>`).join('');
  if(selected&&products.some(p=>p.name===selected))select.value=selected;
  loadAdminProduct();
}

function loadAdminProduct(){
  const p=products.find(x=>x.name===byId('admin-product').value)||products[0];
  if(!p)return;
  byId('admin-name').value=p.name;
  byId('admin-type').value=p.type||'T-Shirt';
  byId('admin-color').value=p.color||tshirtColorForProduct(p.name);
  byId('admin-theme').value=(p.theme||[]).join(', ');
  byId('admin-tags').value=(p.tags||[]).join(' ');
}

function productFromAdmin(){
  return normalizeProduct({
    name:byId('admin-name').value,
    type:byId('admin-type').value,
    color:byId('admin-color').value,
    theme:byId('admin-theme').value,
    tags:byId('admin-tags').value
  });
}

function saveAdminProduct(){
  const oldName=byId('admin-product').value;
  const product=productFromAdmin();
  if(!product.name){toast('Bitte Produktname eingeben');return}
  const duplicate=products.find(p=>productKey(p.name)===productKey(product.name)&&p.name!==oldName);
  if(duplicate){toast('Name existiert schon');return}
  const index=products.findIndex(p=>p.name===oldName);
  if(index>=0)products[index]=product;
  else products.push(product);
  saveProducts();
  refreshProductSelect(product.name);
  renderProductManager(product.name);
  byId('product').value=product.name;
  onProductChange();
  toast('Produkt gespeichert');
}

function addAdminProduct(){
  const product=productFromAdmin();
  if(!product.name){toast('Bitte Produktname eingeben');return}
  if(products.some(p=>productKey(p.name)===productKey(product.name))){toast('Name existiert schon');return}
  products.push(product);
  saveProducts();
  refreshProductSelect(product.name);
  renderProductManager(product.name);
  byId('product').value=product.name;
  onProductChange();
  toast('Produkt hinzugefügt');
}

function deleteAdminProduct(){
  const name=byId('admin-product').value;
  if(!name||name==='Hose'||name==='Sonstiges'){toast('Dieses Produkt bleibt erhalten');return}
  products=products.filter(p=>p.name!==name);
  saveProducts();
  refreshProductSelect(products[0]?.name);
  renderProductManager(products[0]?.name);
  onProductChange();
  toast('Produkt gelöscht');
}

function resetProducts(){
  products=defaultProducts.map(normalizeProduct);
  saveProducts();
  refreshProductSelect(products[0]?.name);
  renderProductManager(products[0]?.name);
  onProductChange();
  toast('Standardliste wiederhergestellt');
}

function resetForm(){
  ['size','color','details','keywords'].forEach(id=>byId(id).value='');
  byId('condition').value='Neu und ungetragen';
  byId('style').value='clean';
  variant++;
  generateListing();
}
function toast(text){
  const el=byId('toast');
  el.textContent=text;
  el.hidden=false;
  clearTimeout(window.toastTimer);
  window.toastTimer=setTimeout(()=>el.hidden=true,1400);
}

['size','color','condition','style','details','keywords'].forEach(id=>{
  window.addEventListener('DOMContentLoaded',()=>byId(id).addEventListener('input',()=>generateListing()));
});
window.addEventListener('DOMContentLoaded',init);
