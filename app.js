const productListVersion='2026-06-24-tshirt-list-v2';
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
  website:'maisonrivage.eu',
  style:'Stockholm Style / Old Money Look',
  fit:'Baggy Fit',
  fabric:'Der Stoff fällt leicht und dünn aus, was sie perfekt für warme Sommertage macht.',
  reason:'nur einmal getragen'
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
  'Heyy 😊 Ich verkaufe diese blau-weiß gestreifte Sommerhose',
  'Hey! 👋 Zum Verkauf steht diese schöne blau-weiß gestreifte Herren-Sommerhose',
  'Ich verkaufe diese blau-weiß gestreifte Herren-Sommerhose',
  'Heyy 😊 Angeboten wird diese lässige blau-weiß gestreifte Sommerhose',
  'Hey 👋 Ich trenne mich von dieser blau-weiß gestreiften Sommerhose',
  'Zum Verkauf steht diese blau-weiß gestreifte Sommerhose im Baggy Fit'
];

const hoseConditionLines=[
  'Sie wurde nur einmal getragen und ist dementsprechend noch in einem sehr guten Zustand.',
  'Ich habe sie nur einmal getragen - sie ist daher noch in einem sehr guten, fast neuwertigen Zustand.',
  'Die Hose wurde nur einmal getragen und befindet sich deshalb in einem nahezu neuwertigen Zustand.',
  'Getragen wurde sie lediglich einmal, daher ist sie noch sehr gepflegt und fast wie neu.',
  'Sie ist kaum getragen und befindet sich noch in einem sehr guten, gepflegten Zustand.',
  'Nur einmal getragen, weshalb sie sich noch in einem top Zustand befindet.'
];

const hoseSummerLines=[
  'Die Hose hat einen schönen Baggy Fit und ist perfekt luftig. 🌊',
  'Der Stoff fällt leicht und dünn aus, was sie perfekt für warme Sommertage macht.',
  'Der leichte und dünne Stoff macht sie ideal für Sommer, Urlaub und warme Tage.',
  'Sie trägt sich angenehm luftig - der Stoff ist sehr leicht und dünn.',
  'Durch den dünnen Stoff und den Baggy Fit eignet sie sich perfekt für warme Sommertage.',
  'Perfekt luftig durch den lockeren Baggy Fit und den leichten Stoff - ideal für den Sommer.'
];

const hoseStyleLines=[
  'Die blau-weißen Streifen geben der Hose einen tollen Stockholm Style / Old Money Look.',
  'Durch die blau-weißen Streifen wirkt sie clean und passt perfekt zum Stockholm Style / Old Money Look.',
  'Die blau-weißen Streifen sorgen für einen hochwertigen Old Money Style und einen sommerlichen Stockholm Look.',
  'Optisch passt sie super zu einem Stockholm Style, Old Money Look oder einem sommerlichen Coastal Outfit.',
  'Der klassische Streifenprint passt perfekt zum Old Money Style und Stockholm Aesthetic.',
  'Mit dem blau-weißen Streifen-Design trifft sie genau den Stockholm Style / Old Money Trend.'
];

const hoseFitpicLines=[
  '📸 Falls ihr ein Fitpic möchtet, schreibt mir gerne!',
  '📸 Auf Wunsch schicke ich euch gerne ein Fitpic!',
  '📸 Schreibt mir, wenn ihr ein Fitpic wollt - kein Problem!',
  '📸 Bei Interesse am Fitpic einfach kurz melden!'
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
let studioImage=null;
let studioSeed=Math.floor(Date.now()%10000);
const studioStyles=['realistic-oak','realistic-light','realistic-walnut','realistic-ash'];
const studioStyleNames={
  'realistic-oak':'Realistische Eiche',
  'realistic-light':'Helle Eiche',
  'realistic-walnut':'Warmer Nussbaum',
  'realistic-ash':'Neutrale Esche'
};
const parquetTexture=new Image();
let parquetTextureReady=false;
parquetTexture.onload=()=>{
  parquetTextureReady=true;
  renderStudio();
};
parquetTexture.src='./assets/realistic-oak-parquet.png';

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
}

function init(){
  refreshProductSelect();
  loadTemplates();
  renderProductManager();
  onProductChange();
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
    `${titleName} T-Shirt | Gr. ${size} | 215 GSM | Stockholm Style`,
    `${titleName} T-Shirt | Größe ${size} | Old Money Style | Yacht Club Look`,
    `${titleName} T-Shirt | ${size} | Heavy Cotton | Stockholm / Old Money`,
    `${titleName} T-Shirt | Größe ${size} | Old Money Style | Riviera Look`,
    `${titleName} T-Shirt | Gr. ${size} | Stockholm Style | Heavy Cotton`
  ];
  const tIdx=variant%6;
  const title=titleVariants[tIdx%titleVariants.length];
  const tags=[...new Set([...p.tags,'#heavycotton','#215gsm','#oldmoneystyle','#stockholmstyle','#sommeroutfit','#herrenmode','#streetwear','#customshirt','#maisonrivage'])].join(' ');
  const shortName=cleanTshirtTitleName(p.name).replace(/^Maison Rivage\s+/,'');
  const introOptions=[
    `Hey 👋 Ich verkaufe dieses Maison Rivage ${shortName} T-Shirt in Größe ${size}.`,
    `Ich biete hier dieses Maison Rivage T-Shirt in Größe ${size} an.`,
    `Hey! 😊 Verkauft wird dieses Maison Rivage ${shortName} Shirt in Größe ${size}.`,
    `Ich verkaufe hier ein Maison Rivage T-Shirt in Größe ${size}.`,
    `Hey 👋 Ich trenne mich von diesem Maison Rivage ${shortName} T-Shirt in Größe ${size}.`,
    `Heyy 😊 Zum Verkauf steht dieses Maison Rivage ${shortName} T-Shirt in Größe ${size}.`
  ];
  const lookOptions=[
    'Das Shirt hat einen cleanen, sommerlichen Look und passt sehr gut zu Chinos, Shorts oder einer leichten Sommerhose.',
    'Der Look wirkt hochwertig, maritim und lässt sich sehr gut im Sommer kombinieren.',
    'Vom Stil her passt es perfekt zu Riviera, Old Money Style, Streetwear oder einem cleanen Casual-Outfit.',
    'Es ist ideal für warme Tage und lässt sich einfach mit Shorts, Jeans oder Sommerhose tragen.',
    'Kombinieren kann man es super mit Chinos, hellen Shorts oder einer lockeren Sommerhose.',
    'Perfekt für den Stockholm Style oder Old Money Look - kombiniert sich easy zu fast allem.'
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
    [introOptions[tIdx%introOptions.length],'',`Zum T-Shirt:`,`Größe: ${size}`,`Länge: ${measure.length}`,`Breite: ${measure.width}`,'Material: 100 % Baumwolle','215 GSM Heavy Cotton','Regular Fit','Selbst bedruckt','',lookOptions[tIdx%lookOptions.length],'',`📦 ${shipping}`,`Bei Fragen oder Interesse gerne melden 😊`,'',tags],
    [introOptions[tIdx%introOptions.length],lookOptions[tIdx%lookOptions.length],'',`Farbe / Design: ${color}.`,materialLine,'Marke: Maison Rivage.','Selbst bedruckt.','','Details:',details,'',shipping,'',contact,'',tags],
    [introOptions[tIdx%introOptions.length],'',`Die wichtigsten Details:`,`Größe ${size} | Länge ${measure.length} | Breite ${measure.width}`,`${color} | ${capRequired.material} | 215 GSM Heavy Cotton`,'Selbst bedruckt','',lookOptions[tIdx%lookOptions.length],'',`📦 ${shipping} ${contact}`,'',tags],
    [introOptions[tIdx%introOptions.length],lookOptions[tIdx%lookOptions.length],'','Maße & Material:','Marke: Maison Rivage',`Größe: ${size}`,`Länge: ${measure.length}`,`Breite: ${measure.width}`,`Farbe / Design: ${color}`,'100 % Baumwolle','215 GSM Heavy Cotton','Selbst bedruckt','',`📦 ${shipping}`,'',contact,'',tags],
    [`${introOptions[tIdx%introOptions.length]} ${lookOptions[tIdx%lookOptions.length]}`,'',`Details: Maison Rivage, Größe ${size}, Länge ${measure.length}, Breite ${measure.width}, ${color}.`,`${materialLine} Das Shirt ist selbst bedruckt.`,'',`📦 ${shipping}`,'',contact,'',tags],
    [introOptions[tIdx%introOptions.length],'',lookOptions[tIdx%lookOptions.length],'',`Zum Shirt: Größe ${size}, Länge ${measure.length}, Breite ${measure.width}.`,`Farbe / Design: ${color}.`,materialLine,'Selbst bedruckt.','',`📦 ${shipping} ${contact}`,'',tags]
  ];
  byId('title').value=title;
  byId('description').value=layouts[tIdx%layouts.length].join('\n').replace(/\n{3,}/g,'\n\n').trim();
  byId('variant-label').textContent=`T-Shirt Variante ${variant}`;
}

function generateHoseListing(p){
  const size=(p.size||'M').toUpperCase();
  const measure=hoseSizeData[size]||hoseSizeData.M;
  const titleVariants=[
    `${hoseRequired.titleBase} | Größe ${size} | Baggy Fit | Old Money Style`,
    `${hoseRequired.titleBase} | Gr. ${size} | Baggy Fit | Stockholm Style`,
    `${hoseRequired.titleBase} | Größe ${size} | Baggy Fit | Stockholm / Old Money`,
    `${hoseRequired.titleBase} | ${size} | Baggy Fit | Old Money Sommerhose`,
    `${hoseRequired.titleBase} Baggy Fit | Größe ${size} | Stockholm Style`,
    `${hoseRequired.titleBase} | ${size} | Baggy Fit | Coastal Old Money Look`
  ];
  const title=titleVariants[variant%titleVariants.length];
  const hashtags=hoseHashtags.join(' ');
  const vIdx=variant%6;
  const intro=`${hoseOpeners[vIdx%hoseOpeners.length]} in Größe ${size}. ${hoseConditionLines[vIdx%hoseConditionLines.length]}`;
  const summerLine=hoseSummerLines[vIdx%hoseSummerLines.length];
  const styleLine=hoseStyleLines[vIdx%hoseStyleLines.length];
  const fitpic=hoseFitpicLines[vIdx%hoseFitpicLines.length];
  const measureBlock=[
    `* Größe: ${size}`,
    `* Länge: ${measure.length}`,
    `* Bundweite: ${measure.waist}`,
    `* Baggy Fit`
  ].join('\n');
  const compareNote=`Zum Vergleich: ${measure.compare}.`;
  const linkBlock=`Gekauft wurde sie hier: ${hoseRequired.website}`;
  const shipping='📦 Der Versand erfolgt meist innerhalb von 24 Stunden.';
  const contact='Bei Fragen oder Interesse gerne schreiben 😊';
  const layouts=[
    [
      intro,'',
      summerLine,'',
      measureBlock,'',
      compareNote,'',
      fitpic,'',
      linkBlock,'',
      shipping,'',
      hashtags
    ],
    [
      intro,'',
      `${summerLine} ${styleLine}`,'',
      measureBlock,'',
      compareNote,'',
      fitpic,'',
      linkBlock,'',
      `${shipping} ${contact}`,'',
      hashtags
    ],
    [
      intro,'',
      styleLine,'',
      summerLine,'',
      '',
      measureBlock,'',
      compareNote,'',
      fitpic,'',
      linkBlock,'',
      shipping,
      contact,'',
      hashtags
    ],
    [
      intro,'',
      `${summerLine} ${styleLine}`,'',
      `Maße: Größe ${size}, Länge ${measure.length}, Bundweite ${measure.waist} (Baggy Fit).`,
      compareNote,'',
      fitpic,'',
      linkBlock,'',
      shipping,'',
      contact,'',
      hashtags
    ],
    [
      intro,'',
      summerLine,
      styleLine,'',
      measureBlock,'',
      compareNote,'',
      fitpic,'',
      linkBlock,'',
      shipping,'',
      hashtags
    ],
    [
      intro,'',
      `${styleLine} ${summerLine}`,'',
      '',
      measureBlock,'',
      compareNote,'',
      fitpic,'',
      linkBlock,'',
      `${shipping} ${contact}`,'',
      hashtags
    ]
  ];
  const text=layouts[vIdx%layouts.length].join('\n').replace(/\n{3,}/g,'\n\n').trim();
  byId('title').value=title;
  byId('description').value=text;
  byId('variant-label').textContent=`Hose Variante ${variant}`;
}

function generateCapListing(p){
  const size=(p.size||'L').toUpperCase();
  const measure=tshirtSizeData[size]||tshirtSizeData.L;
  const titleVariants=[
    `${capRequired.titleBase} | Größe ${size} | Heavy Cotton | Old Money Style`,
    `${capRequired.titleBase} | Gr. ${size} | 215 GSM | Stockholm Style`,
    `${capRequired.titleBase} | Größe ${size} | Old Money Style | Yacht Club Look`,
    `${capRequired.titleBase} | ${size} | Stockholm Style | Heavy Cotton`,
    `${capRequired.titleBase} | Größe ${size} | Old Money Style | Riviera Look`,
    `${capRequired.titleBase} | Gr. ${size} | Stockholm / Old Money Style`
  ];
  const cIdx=variant%6;
  const title=titleVariants[cIdx%titleVariants.length];
  const hashtags=capHashtags.join(' ');
  const intro=`${capOpeners[cIdx%capOpeners.length]} - perfekt für den Sommer, sowohl vom Fit als auch vom Look her.`;
  const styleLine=`${capLookLines[cIdx%capLookLines.length]} ${capFitLines[cIdx%capFitLines.length]}`;
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
      intro,'',
      styleLine,'',
      'Details:',
      detailBlock,'',
      `📦 ${shipping}`,'',
      contact,'',
      hashtags
    ],
    [
      intro,'',
      'Die wichtigsten Details:',
      `Größe ${size} | Länge ${measure.length} | Breite ${measure.width}`,
      `${capRequired.color}, ${capRequired.material}, ${capRequired.weight}`,
      capRequired.print,'',
      styleLine,'',
      `📦 ${shipping} ${contact}`,'',
      hashtags
    ],
    [
      `${intro} ${styleLine}`,'',
      'Maße & Material:',
      `Größe: ${size}`,
      `Länge: ${measure.length}`,
      `Breite: ${measure.width}`,
      `Farbe: ${tshirtColorForProduct(p.name)}`,
      `Material: ${capRequired.material}`,
      `${capRequired.weight} - angenehm schwer und hochwertig im Griff`,
      capRequired.print,'',
      `📦 ${shipping}`,
      contact,'',
      hashtags
    ],
    [
      `Verkaufe ein weißes Maison Rivage Shirt in Größe ${size} mit Cap d'Antibes / Yacht Club Design.`,'',
      styleLine,
      `Der Stoff besteht aus ${capRequired.material}; mit ${capRequired.weight} fühlt sich das Shirt angenehm schwer und hochwertig an.`,'',
      `Details: Größe ${size}, Länge ${measure.length}, Breite ${measure.width}, Farbe ${tshirtColorForProduct(p.name)}, ${capRequired.print}.`,'',
      `📦 ${shipping}`,'',
      contact,'',
      hashtags
    ],
    [
      intro,'',
      `Zum Shirt:`,
      `Größe: ${size}`,
      `Länge: ${measure.length}`,
      `Breite: ${measure.width}`,
      `Farbe: ${tshirtColorForProduct(p.name)}`,
      '100 % Baumwolle | 215 GSM Heavy Cotton',
      capRequired.print,'',
      styleLine,'',
      `📦 ${shipping} ${contact}`,'',
      hashtags
    ],
    [
      `${intro} ${styleLine}`,'',
      `Details: Maison Rivage, Größe ${size}, Länge ${measure.length}, Breite ${measure.width}.`,
      `Farbe: ${tshirtColorForProduct(p.name)}. ${capRequired.material}, ${capRequired.weight}. ${capRequired.print}.`,'',
      `📦 ${shipping}`,'',
      contact,'',
      hashtags
    ]
  ];
  byId('title').value=title;
  byId('description').value=layouts[cIdx%layouts.length].join('\n').replace(/\n{3,}/g,'\n\n').trim();
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
  localStorage.setItem('ph_listing_templates',JSON.stringify({
    start:byId('template-start').value,
    end:byId('template-end').value
  }));
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

function seededNoise(seed){
  const x=Math.sin(seed*12.9898)*43758.5453;
  return x-Math.floor(x);
}

function woodPalette(style){
  const palettes={
    oak:{base:'#d8bb8a',light:'#edd6a8',dark:'#a97842',line:'rgba(94,58,28,.25)'},
    walnut:{base:'#a46b3f',light:'#c7925d',dark:'#694123',line:'rgba(54,31,15,.32)'},
    ash:{base:'#c7b9a2',light:'#e2d7c5',dark:'#8d806c',line:'rgba(70,63,53,.24)'}
  };
  return palettes[style]||palettes.oak;
}

function shadeWood(hex,amount){
  const n=parseInt(hex.slice(1),16);
  const r=Math.max(0,Math.min(255,((n>>16)&255)+amount*255));
  const g=Math.max(0,Math.min(255,((n>>8)&255)+amount*255));
  const b=Math.max(0,Math.min(255,(n&255)+amount*255));
  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
}

function currentStudioStyle(){
  return studioStyles[Math.abs(studioSeed)%studioStyles.length];
}

function updateStudioLabel(style=currentStudioStyle()){
  const label=byId('studio-bg-label');
  if(label)label.textContent=studioStyleNames[style]||'Automatisch';
}

function drawParquet(ctx,w,h,style='realistic-oak'){
  if(style.startsWith('realistic')&&parquetTextureReady){
    ctx.save();
    ctx.filter=realisticFloorFilter(style);
    drawImageCover(ctx,parquetTexture,0,0,w,h,studioSeed);
    ctx.restore();
    polishRealisticFloor(ctx,w,h,style);
    return;
  }

  const p=woodPalette(style);
  const bg=ctx.createLinearGradient(0,0,w,h);
  bg.addColorStop(0,p.light);
  bg.addColorStop(.45,p.base);
  bg.addColorStop(1,p.dark);
  ctx.fillStyle=bg;
  ctx.fillRect(0,0,w,h);

  const plankH=Math.max(118,Math.round(h/9));
  const plankW=Math.max(310,Math.round(w/3.25));
  ctx.lineWidth=3;
  for(let y=-plankH;y<h+plankH;y+=plankH){
    const row=Math.floor((y+plankH)/plankH);
    const offset=row%2?-plankW/2:0;
    for(let x=-plankW;x<w+plankW;x+=plankW){
      const nx=x+offset;
      const noise=seededNoise((nx+31)*.017+(y+studioSeed)*.011);
      const grad=ctx.createLinearGradient(nx,y,nx+plankW,y+plankH);
      grad.addColorStop(0,shadeWood(p.light,noise*.08));
      grad.addColorStop(.52,shadeWood(p.base,noise*.14-.04));
      grad.addColorStop(1,shadeWood(p.dark,noise*.08));
      ctx.fillStyle=grad;
      ctx.fillRect(nx,y,plankW,plankH);
      ctx.strokeStyle=p.line;
      ctx.strokeRect(nx,y,plankW,plankH);

      ctx.save();
      ctx.beginPath();
      ctx.rect(nx+10,y+10,plankW-20,plankH-20);
      ctx.clip();
      for(let i=0;i<9;i++){
        const yy=y+18+i*(plankH/9)+seededNoise(nx+y+i+studioSeed)*9;
        ctx.beginPath();
        ctx.moveTo(nx+14,yy);
        ctx.bezierCurveTo(nx+plankW*.35,yy-12,nx+plankW*.62,yy+14,nx+plankW-14,yy-4);
        ctx.strokeStyle=`rgba(88,54,28,${.09+noise*.06})`;
        ctx.lineWidth=1.2;
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  const gloss=ctx.createRadialGradient(w*.34,h*.08,20,w*.34,h*.08,w*.82);
  gloss.addColorStop(0,'rgba(255,255,255,.28)');
  gloss.addColorStop(.58,'rgba(255,255,255,.08)');
  gloss.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle=gloss;
  ctx.fillRect(0,0,w,h);
}

function drawImageCover(ctx,img,x,y,w,h,seed=0){
  const scale=Math.max(w/img.width,h/img.height);
  const sw=w/scale;
  const sh=h/scale;
  const maxX=Math.max(0,img.width-sw);
  const maxY=Math.max(0,img.height-sh);
  const sx=maxX*(.28+seededNoise(seed+19)*.44);
  const sy=maxY*(.34+seededNoise(seed+37)*.32);
  ctx.drawImage(img,sx,sy,sw,sh,x,y,w,h);
}

function realisticFloorFilter(style){
  const filters={
    'realistic-oak':'saturate(1.06) contrast(1.04) brightness(1.02)',
    'realistic-light':'saturate(.96) contrast(1.02) brightness(1.14)',
    'realistic-walnut':'sepia(.28) saturate(1.22) contrast(1.08) brightness(.9)',
    'realistic-ash':'saturate(.64) contrast(1.06) brightness(1.04)'
  };
  return filters[style]||filters['realistic-oak'];
}

function polishRealisticFloor(ctx,w,h,style='realistic-oak'){
  const overlays={
    'realistic-oak':['rgba(255,232,190,.18)','rgba(141,83,30,.12)','rgba(76,48,22,.18)'],
    'realistic-light':['rgba(255,246,222,.24)','rgba(196,142,75,.08)','rgba(84,58,33,.13)'],
    'realistic-walnut':['rgba(174,100,45,.16)','rgba(75,38,16,.22)','rgba(42,24,12,.25)'],
    'realistic-ash':['rgba(226,222,214,.22)','rgba(110,103,91,.12)','rgba(56,52,46,.17)']
  };
  const tone=overlays[style]||overlays['realistic-oak'];
  const warmth=ctx.createLinearGradient(0,0,w,h);
  warmth.addColorStop(0,tone[0]);
  warmth.addColorStop(.55,'rgba(255,255,255,.02)');
  warmth.addColorStop(1,tone[1]);
  ctx.fillStyle=warmth;
  ctx.fillRect(0,0,w,h);

  const vignette=ctx.createRadialGradient(w*.5,h*.44,w*.18,w*.5,h*.44,w*.76);
  vignette.addColorStop(0,'rgba(255,255,255,.08)');
  vignette.addColorStop(.58,'rgba(255,255,255,0)');
  vignette.addColorStop(1,tone[2]);
  ctx.fillStyle=vignette;
  ctx.fillRect(0,0,w,h);
}

function handleStudioUpload(event){
  const file=event.target.files?.[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{
    const img=new Image();
    img.onload=()=>{
      studioImage=img;
      renderStudio();
      toast('Bild geladen');
    };
    img.src=reader.result;
  };
  reader.readAsDataURL(file);
}

function renderStudio(){
  const canvas=byId('studio-canvas');
  if(!canvas)return;
  const format=byId('studio-format')?.value||'square';
  canvas.width=1080;
  canvas.height=format==='portrait'?1350:1080;
  const ctx=canvas.getContext('2d');
  const w=canvas.width;
  const h=canvas.height;
  const floorStyle=currentStudioStyle();
  updateStudioLabel(floorStyle);
  drawParquet(ctx,w,h,floorStyle);

  const scale=(Number(byId('studio-scale')?.value)||74)/100;
  const shiftY=Number(byId('studio-y')?.value)||0;
  const rotate=((Number(byId('studio-rotate')?.value)||0)*Math.PI)/180;
  const cx=w/2;
  const cy=h*.52+shiftY;
  const targetW=w*scale;

  ctx.save();
  ctx.translate(cx,cy);
  ctx.rotate(rotate);
  ctx.filter='blur(24px)';
  ctx.fillStyle='rgba(20,18,14,.24)';
  ctx.beginPath();
  ctx.ellipse(0,targetW*.35,targetW*.42,targetW*.12,0,0,Math.PI*2);
  ctx.fill();
  ctx.restore();
  ctx.filter='none';

  if(studioImage){
    const ratio=studioImage.height/studioImage.width;
    const targetH=targetW*ratio;
    ctx.save();
    ctx.translate(cx,cy);
    ctx.rotate(rotate);
    ctx.shadowColor='rgba(22,18,12,.28)';
    ctx.shadowBlur=28;
    ctx.shadowOffsetY=18;
    ctx.drawImage(studioImage,-targetW/2,-targetH/2,targetW,targetH);
    ctx.restore();
  }else{
    drawStudioPlaceholder(ctx,w,h);
  }
}

function roundedRect(ctx,x,y,w,h,r){
  if(ctx.roundRect){
    ctx.roundRect(x,y,w,h,r);
    return;
  }
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
}

function drawStudioPlaceholder(ctx,w,h){
  const cx=w/2;
  const cy=h*.5;
  ctx.save();
  ctx.fillStyle='rgba(255,255,255,.78)';
  ctx.strokeStyle='rgba(0,119,130,.28)';
  ctx.lineWidth=4;
  ctx.beginPath();
  roundedRect(ctx,cx-250,cy-215,500,430,42);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle='#007782';
  ctx.font='900 76px -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif';
  ctx.textAlign='center';
  ctx.fillText('PH',cx,cy-10);
  ctx.fillStyle='rgba(21,23,22,.68)';
  ctx.font='500 34px -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif';
  ctx.fillText('T-Shirt Bild auswählen',cx,cy+58);
  ctx.restore();
}

function randomizeStudio(){
  studioSeed=Math.floor(Math.random()*10000);
  const rotate=byId('studio-rotate');
  const y=byId('studio-y');
  const scale=byId('studio-scale');
  if(rotate)rotate.value=Math.round(seededNoise(studioSeed+1)*10-5);
  if(y)y.value=Math.round(seededNoise(studioSeed+2)*90-35);
  if(scale)scale.value=Math.round(68+seededNoise(studioSeed+3)*16);
  renderStudio();
}

function downloadStudioImage(){
  const canvas=byId('studio-canvas');
  if(!canvas)return;
  const save=url=>{
    const a=document.createElement('a');
    a.href=url;
    a.download='ph-vinted-produktfoto.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast('Bild gespeichert');
    setTimeout(()=>URL.revokeObjectURL(url),1200);
  };
  if(canvas.toBlob){
    canvas.toBlob(blob=>blob&&save(URL.createObjectURL(blob)),'image/png',1);
  }else{
    const a=document.createElement('a');
    a.href=canvas.toDataURL('image/png');
    a.download='ph-vinted-produktfoto.png';
    a.click();
  }
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
window.addEventListener('DOMContentLoaded',()=>{
  init();
  renderStudio();
});
