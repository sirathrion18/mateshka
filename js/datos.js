/* Матешка · utilidades y datos de los libros (A1, Primeros pasos, A2 21–23, casos y consignas). */
/* ---------- helpers ---------- */
const ST="́";
function A(s){return typeof s==="string"?s.replace(/'/g,ST):s}
function deep(o){if(Array.isArray(o))return o.map(deep);if(o&&typeof o==="object"){const r={};for(const k in o)r[k]=deep(o[k]);return r}return A(o)}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function norm(s){return String(s).toLowerCase().replace(/́/g,"").replace(/ё/g,"е").replace(/[.,!?¿¡«»"“”—–:;()]/g," ").replace(/\s+/g," ").trim()}
function bare(s){return String(s).replace(/́/g,"")}
function uid(){return Math.random().toString(36).slice(2,9)}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
const MESES=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
const DIAS=["dom","lun","mar","mié","jue","vie","sáb"];
function dstr(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
const today=()=>dstr(new Date());
function pd(s){const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)}
const isRu=s=>/[а-яё]/i.test(s);
const val=id=>{const e=document.getElementById(id);return e?e.value.trim():""};


/* ===== Datos del libro: Русский язык. 5 элементов A1 (Т. Эсмантова) =====
   Vocabulario: Словарь к урокам 1–20 (pp. 287–292). Traducciones al castellano: sugeridas por la app. */
const VOC_RAW={
1:"не|no;да ≠ нет|sí ≠ no;здра'вствуй(те)|hola;до свида'ния|chau, hasta luego;пожа'луйста|por favor;спаси'бо|gracias;и'ли|o;преподава'тель|profesor, profesora;профе'ссия|profesión;инжене'р|ingeniero;юри'ст|abogado;экономи'ст|economista;кот|gato;ко'шка|gata;челове'к — лю'ди|persona — personas;ребёнок — де'ти|niño — niños;мужчи'на|hombre;же'нщина|mujer;муж|marido;жена'|esposa;ма'льчик|nene;де'вочка|nena;па'рень|muchacho;де'вушка|chica;оте'ц|padre;мать|madre;роди'тели|padres;сын|hijo;дочь|hija;брат|hermano;сестра'|hermana;де'душка|abuelo;ба'бушка|abuela;внук|nieto;вну'чка|nieta;дя'дя|tío;тётя|tía;семья'|familia;пра'вда|verdad;дом|casa, edificio;до'ма|en casa;рабо'та|trabajo;то'же|también;кни'га|libro;ру'чка|birome;каранда'ш|lápiz",
2:"сло'во|palabra;слова'рь|diccionario;де'ньги|dinero;счёт|cuenta;ци'фра|cifra, número;всё равно'|da igual;молоко'|leche;вода'|agua;сок|jugo;хлеб|pan;ещё|todavía, más;потому' что|porque;официа'нт|mozo;хорошо' ≠ пло'хо|bien ≠ mal;прекра'сно ≠ ужа'сно|excelente ≠ horrible;отли'чно|muy bien;о'чень|muy;О'чень прия'тно!|¡Mucho gusto!;Как у вас дела'?|¿Cómo le va?;Как вас зову'т?|¿Cómo se llama?;кварти'ра|departamento;стул — сту'лья|silla — sillas;вещь|cosa;жизнь|vida;крова'ть|cama;тетра'дь|cuaderno;любо'вь|amor;це'рковь|iglesia;дверь|puerta;здесь ≠ там|acá ≠ allá;вот ≠ вон|acá está ≠ allá está;тра'нспорт|transporte;авто'бус|colectivo;трамва'й|tranvía;тролле'йбус|trolebús",
3:"но|pero;не…, а…|no…, sino…;сейча'с|ahora;коне'чно|claro;ва'жно|es importante;биле'т|boleto, entrada;извини'(те)!|¡perdón!;Как жаль!|¡Qué lástima!;к сожале'нию|lamentablemente;сча'стье|felicidad;к сча'стью|por suerte;часы'|reloj;самолёт|avión;велосипе'д|bicicleta;да'ча|casa de campo;друг, подру'га|amigo, amiga;соба'ка|perro;до'рого ≠ дёшево|caro ≠ barato;тру'дно ≠ легко'|difícil ≠ fácil;логи'чно|es lógico;магази'н|negocio, tienda;апте'ка|farmacia;де'ло|asunto;расска'з|relato;вопро'с|pregunta;отве'т|respuesta;вре'мя|tiempo;Ско'лько вре'мени?|¿Qué hora es?;то'лько|solo;так|así;Ско'лько сто'ит?|¿Cuánto cuesta?",
4:"очки'|anteojos;сле'ва ≠ спра'ва|a la izquierda ≠ a la derecha;наверху' ≠ внизу'|arriba ≠ abajo;сза'ди ≠ впереди'|atrás ≠ adelante;ю'бка|pollera;брю'ки|pantalón;вме'сте|juntos;сосе'д, сосе'дка|vecino, vecina;шко'льник|alumno de escuela;пенсионе'р|jubilado",
5:"почти'|casi;страна'|país;иностра'нец|extranjero;я'блоко|manzana;снача'ла… пото'м|primero… después;сли'шком|demasiado;у'лица|calle;проспе'кт|avenida;то'чно|exactamente;переры'в|pausa, recreo;по'вар|cocinero;ещё ≠ уже'|todavía ≠ ya;пра'вильно|correcto;сда'ча|vuelto;но'вость|noticia;во'зраст|edad;неде'ля|semana;ме'сяц|mes;год|año;е'сли|si (condicional);обы'чно|normalmente;стра'нно|es raro;Что зна'чит…?|¿Qué significa…?;фами'лия|apellido;и'мя|nombre;о'тчество|patronímico",
6:"мно'го ≠ ма'ло|mucho ≠ poco;чуть-чу'ть|un poquito;везде' ≠ нигде'|en todas partes ≠ en ninguna;ме'сто|lugar;до'лго|mucho tiempo;краси'во|lindo;гро'мко ≠ ти'хо|fuerte ≠ bajito;бы'стро ≠ ме'дленно|rápido ≠ despacio;интере'сно ≠ ску'чно|interesante ≠ aburrido;за'втрак|desayuno;обе'д|almuerzo;у'жин|cena;о'тдых|descanso;игра'|juego;когда'|cuando;у'тро|mañana (parte del día);день|día;ве'чер|tarde, noche;ночь|noche;у'тром|a la mañana;днём|de día;ве'чером|a la noche;но'чью|de madrugada;секу'нда|segundo;мину'та|minuto;час|hora;по'здно ≠ ра'но|tarde ≠ temprano;ра'ньше|antes;никогда' (не)|nunca;иногда'|a veces",
7:"всегда'|siempre;вчера'|ayer;сего'дня|hoy;за'втра|mañana;До за'втра!|¡Hasta mañana!;нача'ло|comienzo;коне'ц|final;роль|papel (en una obra);зада'ние|tarea, ejercicio;дома'шнее зада'ние|tarea para la casa;позавчера'|anteayer;послеза'втра|pasado mañana;час наза'д ≠ че'рез час|hace una hora ≠ en una hora;су'мка|bolso;чемода'н|valija;ко'мната|habitación;ку'хня|cocina",
8:"окно'|ventana;вку'сно|rico, sabroso;помидо'р|tomate;сыр|queso;ма'сло|aceite, manteca;яйцо'|huevo;соль|sal;са'хар|azúcar;моро'женое|helado;ко'фе|café;чай|té;ры'ба|pescado;мя'со|carne;осо'бенно|especialmente;плита'|anafe, cocina;спаси'бо за…|gracias por…;письмо'|carta;сове'т|consejo;по'мощь|ayuda",
9:"так как|ya que;поэ'тому|por eso;оши'бка|error;учи'тель|maestro;строи'тель|constructor;па'мять|memoria;давно' ≠ неда'вно|hace mucho ≠ hace poco;ско'ро|pronto;далеко' ≠ бли'зко|lejos ≠ cerca;пого'да|tiempo, clima;дождь|lluvia;снег|nieve;со'лнце|sol;ве'тер|viento;хо'лодно — тепло' — жа'рко|hace frío — templado — calor;зима'|invierno;весна'|primavera;ле'то|verano;о'сень|otoño;зимо'й|en invierno;весно'й|en primavera;ле'том|en verano;о'сенью|en otoño",
10:"весь, вся, всё, все|todo, toda, todos;не то'лько…, но и…|no solo…, sino también…;о'тпуск|vacaciones;о'бувь|calzado;ме'бель|muebles;те'ло|cuerpo;голова'|cabeza;се'рдце|corazón;лицо'|cara;глаз — глаза'|ojo — ojos;нос|nariz;рот|boca;у'хо — у'ши|oreja — orejas;плечо'|hombro;рука'|mano, brazo;нога'|pie, pierna;го'лос — голоса'|voz — voces;де'рево — дере'вья|árbol — árboles;лист — ли'стья|hoja — hojas;лес — леса'|bosque — bosques;го'род — города'|ciudad — ciudades;по'езд — поезда'|tren — trenes;о'стров — острова'|isla — islas;бе'рег — берега'|orilla — orillas;цвет — цвета'|color — colores;век — века'|siglo — siglos;врач|médico;ча'сто ≠ ре'дко|seguido ≠ rara vez;совсе'м|completamente;и т. д.|etcétera",
11:"не'бо|cielo;газе'та|diario;статья'|artículo;пла'тье|vestido;пальто'|abrigo;встре'ча|encuentro;оде'жда|ropa;э'тот, э'та, э'то, э'ти|este, esta, esto, estos;тот, та, то, те|ese, esa, eso, esos",
12:"домохозя'йка|ama de casa;молоде'ц!|¡bien hecho!;ка'чество|calidad;душа'|alma;река'|río;до'лжен, должна', должны'|debe, tiene que;бо'лее ≠ ме'нее…, чем|más ≠ menos… que;тако'й же, как…|igual que…",
13:"лу'чше ≠ ху'же|mejor ≠ peor;ме'ньше ≠ бо'льше|menos ≠ más;зарпла'та|sueldo;мир|mundo, paz;война' ≠ мир|guerra ≠ paz;свет|luz;светло'|hay luz;уче'бник|libro de texto;боти'нки|botines;сапоги'|botas;ту'фли|zapatos;та'пки|pantuflas;земля'|tierra;пиро'жное|masita;покупа'тель|cliente;продаве'ц|vendedor;Бу'дьте здоро'вы!|¡Salud!",
14:"все ≠ никто' (не)|todos ≠ nadie;всё ≠ ничего' (не)|todo ≠ nada;да'же|incluso;наприме'р|por ejemplo;ключ|llave;живо'тное|animal;кре'сло|sillón;наве'рное|seguramente;шу'тка|chiste",
15:"успе'х|éxito;поря'док ≠ ха'ос|orden ≠ caos;по'лка|estante;во'здух|aire;рай ≠ ад|paraíso ≠ infierno;кора'бль|barco;сад (в саду')|jardín;мост (на мосту')|puente;пол (на полу') ≠ потоло'к|piso ≠ techo;у'гол (в углу')|rincón;шкаф (в шкафу')|armario;мёд|miel;медве'дь|oso;мышь|ratón;коро'ва|vaca;свинья'|cerdo;слон|elefante;волк|lobo;обезья'на|mono;се'вер ≠ юг|norte ≠ sur;за'пад ≠ восто'к|oeste ≠ este;гора' (на горе')|montaña;ро'дина|patria;вокза'л|estación de tren;заво'д|fábrica;командиро'вка|viaje de trabajo;экспеди'ция|expedición;внутри' ≠ снару'жи|adentro ≠ afuera;зда'ние|edificio;вы'ставка|exposición;пря'мо|derecho;ремо'нт|arreglo, reforma;фона'рь|farol",
16:"опя'ть|otra vez;день рожде'ния|cumpleaños;обра'тно|de vuelta;туда' ≠ сюда'|hacia allá ≠ hacia acá;домо'й|a casa;пешко'м|a pie",
17:"вор|ladrón;настрое'ние|ánimo;таре'лка|plato;ба'ня|sauna rusa;опа'сно|es peligroso;зонт|paraguas;лифт|ascensor;ла'дно|bueno, dale;уве'рен|seguro (de algo);прав|tiene razón;друг дру'га|uno al otro;кома'нда|equipo",
18:"не'сколько|algunos, varios;холоди'льник|heladera;разме'р|talle;чу'вство|sentimiento;число'|fecha, número;Како'е сего'дня число'?|¿Qué fecha es hoy?",
19:"сра'зу|enseguida;кани'кулы|vacaciones de estudiante;скри'пка|violín;глу'по|es tonto",
20:"пе'сня|canción;напи'ток|bebida;еда'|comida;мы'ло|jabón;о'вощ|verdura;огуре'ц|pepino;морко'вь|zanahoria;гру'ша|pera;виногра'д|uva;смета'на|crema agria;кефи'р|kéfir;уда'ча|suerte;о'ба, о'бе|ambos, ambas;икра'|caviar"
};
/* En el glosario del libro algunas lecciones vienen juntas: la división por урок es aproximada. */
const JOINED={4:"4 y 5",5:"4 y 5",6:"6 y 7",7:"6 y 7",8:"8 y 9",9:"8 y 9",11:"11 y 12",12:"11 y 12",13:"13 y 14",14:"13 y 14",16:"16 y 17",17:"16 y 17",18:"18, 19 y 20",19:"18, 19 y 20",20:"18, 19 y 20"};

/* Verbos: [infinitivo, castellano, урок, grupo, formas (я,ты,он,мы,вы,они) si no son regulares] */
const VERBS_RAW=[
["де'лать","hacer",3,"I"],["знать","saber, conocer",3,"I"],["слу'шать","escuchar",3,"I"],["понима'ть","entender",3,"I"],["изуча'ть","estudiar (a fondo)",3,"I"],["чита'ть","leer",3,"I"],["расска'зывать","contar, relatar",3,"I"],["спра'шивать","preguntar",3,"I"],["отвеча'ть","responder",3,"I"],["ду'мать","pensar",3,"I"],
["рабо'тать","trabajar",4,"I"],["говори'ть","hablar, decir",4,"II","говорю',говори'шь,говори'т,говори'м,говори'те,говоря'т"],
["за'втракать","desayunar",6,"I"],["обе'дать","almorzar",6,"I"],["у'жинать","cenar",6,"I"],["гуля'ть","pasear",6,"I"],["отдыха'ть","descansar",6,"I"],["игра'ть","jugar, tocar",6,"I"],
["начина'ть","empezar",7,"I"],["конча'ть","terminar",7,"I"],["счита'ть","contar, considerar",7,"I"],
["учи'ть","aprender, enseñar",9,"II","учу',у'чишь,у'чит,у'чим,у'чите,у'чат"],["стро'ить","construir",9,"II","стро'ю,стро'ишь,стро'ит,стро'им,стро'ите,стро'ят"],["по'мнить","recordar",9,"II","по'мню,по'мнишь,по'мнит,по'мним,по'мните,по'мнят"],["кури'ть","fumar",9,"II","курю',ку'ришь,ку'рит,ку'рим,ку'рите,ку'рят"],["смотре'ть","mirar, ver",9,"II","смотрю',смо'тришь,смо'трит,смо'трим,смо'трите,смо'трят"],["молча'ть","callar",9,"II","молчу',молчи'шь,молчи'т,молчи'м,молчи'те,молча'т"],["лежа'ть","estar acostado",9,"II","лежу',лежи'шь,лежи'т,лежи'м,лежи'те,лежа'т"],["стоя'ть","estar parado",9,"II","стою',стои'шь,стои'т,стои'м,стои'те,стоя'т"],["жить","vivir",9,"X","живу',живёшь,живёт,живём,живёте,живу'т"],
["люби'ть","amar, gustar",10,"IIa","люблю',лю'бишь,лю'бит,лю'бим,лю'бите,лю'бят"],["быть","ser, estar (futuro)",10,"X","бу'ду,бу'дешь,бу'дет,бу'дем,бу'дете,бу'дут"],["быва'ть","estar seguido, soler",10,"I"],["покупа'ть","comprar",10,"I"],
["хоте'ть","querer",12,"X","хочу',хо'чешь,хо'чет,хоти'м,хоти'те,хотя'т"],["мочь","poder",12,"X","могу',мо'жешь,мо'жет,мо'жем,мо'жете,мо'гут"],
["спать","dormir",13,"IIa","сплю,спишь,спит,спим,спи'те,спят"],["гото'вить","cocinar",13,"IIa","гото'влю,гото'вишь,гото'вит,гото'вим,гото'вите,гото'вят"],["эконо'мить","ahorrar",13,"IIa","эконо'млю,эконо'мишь,эконо'мит,эконо'мим,эконо'мите,эконо'мят"],
["шути'ть","bromear",14,"IIa","шучу',шу'тишь,шу'тит,шу'тим,шу'тите,шу'тят"],
["спо'рить","discutir",15,"II","спо'рю,спо'ришь,спо'рит,спо'рим,спо'рите,спо'рят"],["мечта'ть","soñar (desear)",15,"I"],["писа'ть","escribir",15,"X","пишу',пи'шешь,пи'шет,пи'шем,пи'шете,пи'шут"],
["ви'деть","ver",16,"IIa","ви'жу,ви'дишь,ви'дит,ви'дим,ви'дите,ви'дят"],["сиде'ть","estar sentado",16,"IIa","сижу',сиди'шь,сиди'т,сиди'м,сиди'те,сидя'т"],["ненави'деть","odiar",16,"IIa","ненави'жу,ненави'дишь,ненави'дит,ненави'дим,ненави'дите,ненави'дят"],["звони'ть","llamar por teléfono",16,"II","звоню',звони'шь,звони'т,звони'м,звони'те,звоня'т"],["пока'зывать","mostrar",16,"I"],["приглаша'ть","invitar",16,"I"],["поздравля'ть","felicitar",16,"I"],["опа'здывать","llegar tarde",16,"I"],["ждать","esperar",16,"X","жду,ждёшь,ждёт,ждём,ждёте,ждут"],["не'рвничать","ponerse nervioso",16,"I"],["идти'","ir (a pie, ahora)",16,"X","иду',идёшь,идёт,идём,идёте,иду'т"],["ходи'ть","ir (seguido, ida y vuelta)",16,"IIa","хожу',хо'дишь,хо'дит,хо'дим,хо'дите,хо'дят"],
["повторя'ть","repetir",17,"I"],["снима'ть","alquilar",17,"I"],["арендова'ть","alquilar",17,"OVA"],["выи'грывать","ganar (un juego)",17,"I"],["прои'грывать","perder (un juego)",17,"I"],
["учи'ться","estudiar (en un lugar)",18,"II","учу'сь,у'чишься,у'чится,у'чимся,у'читесь,у'чатся"],["уме'ть","saber hacer",18,"I"],
["дава'ть","dar",19,"VA"],["продава'ть","vender",19,"VA"],["преподава'ть","enseñar (dar clase)",19,"VA"],["узнава'ть","enterarse, reconocer",19,"VA"],["встава'ть","levantarse",19,"VA"],["устава'ть","cansarse",19,"VA"],
["петь","cantar",20,"X","пою',поёшь,поёт,поём,поёте,пою'т"],["пить","tomar, beber",20,"X","пью,пьёшь,пьёт,пьём,пьёте,пьют"],["есть","comer",20,"X","ем,ешь,ест,еди'м,еди'те,едя'т"],["мыть","lavar",20,"X","мо'ю,мо'ешь,мо'ет,мо'ем,мо'ете,мо'ют"]
];
const PAST_OVR={"жить":"жил,жила',жи'ли","спать":"спал,спала',спа'ли","ждать":"ждал,ждала',жда'ли","пить":"пил,пила',пи'ли","быть":"был,была',бы'ли","идти":"шёл,шла,шли","мочь":"мог,могла',могли'","есть":"ел,е'ла,е'ли","учиться":"учи'лся,учи'лась,учи'лись","петь":"пел,пе'ла,пе'ли","мыть":"мыл,мы'ла,мы'ли","давать":"дава'л,дава'ла,дава'ли"};
const VGROUPS=[
 {id:"I",t:"I спряже'ние · -ать / -ять / -еть",es:"Sacás -ть y sumás estas terminaciones.",e:["-ю","-ешь","-ет","-ем","-ете","-ют"]},
 {id:"VA",t:"I спряже'ние · -ава'ть",es:"Pierden -ва- en presente: дава'ть → даю'.",e:["-ю'","-ёшь","-ёт","-ём","-ёте","-ю'т"]},
 {id:"OVA",t:"I спряже'ние · -ова'ть",es:"-ова- cambia a -у-: арендова'ть → аренду'ю.",e:["-ую","-уешь","-ует","-уем","-уете","-уют"]},
 {id:"II",t:"II спряже'ние · -ить / -еть / -ать",es:"Después de ж, ш, ч, щ: -у y -ат.",e:["-ю/-у","-ишь","-ит","-им","-ите","-ят/-ат"]},
 {id:"IIa",t:"II спряже'ние · cambia la consonante en «я»",es:"Solo la forma de «я» cambia: б→бл, в→вл, м→мл, п→пл, д→ж, т→ч.",e:["-лю / -жу / -чу","-ишь","-ит","-им","-ите","-ят"]},
 {id:"X",t:"Irregulares y con cambios",es:"Hay que memorizarlos de a uno.",e:null}
];

/* Adjetivos: [masculino, castellano, урок] */
const ADJ_RAW=[
["большо'й","grande",11],["сре'дний","mediano",11],["ма'ленький","chico",11],["до'брый","bueno (de carácter)",11],["злой","malo, enojado",11],["хоро'ший","bueno",11],["плохо'й","malo",11],["дешёвый","barato",11],["дорого'й","caro, querido",11],["ста'рый","viejo",11],["но'вый","nuevo",11],["молодо'й","joven",11],["чи'стый","limpio",11],["гря'зный","sucio",11],["лёгкий","liviano, fácil",11],["тяжёлый","pesado",11],["тру'дный","difícil",11],["холо'дный","frío",11],["тёплый","templado, cálido",11],["горя'чий","caliente",11],["си'льный","fuerte",11],
["ка'ждый","cada",12],["кото'рый","que, el cual",12],["голо'дный","hambriento",12],["у'мный","inteligente",12],["дли'нный","largo",12],
["све'тлый","claro, luminoso",13],["люби'мый","favorito",13],["весёлый","alegre",13],
["живо'й","vivo",14],["друго'й","otro",14],["прямо'й","recto, directo",15],
["после'дний","último",17],["споко'йный","tranquilo",17],["опа'сный","peligroso",17],
["ра'зный","distinto, variado",18],["прохла'дный","fresco",18],["бога'тый","rico (con plata)",18],["бе'дный","pobre",18],["про'шлый","pasado",18],["бу'дущий","futuro",18],["сле'дующий","siguiente",18],
["высо'кий","alto",19],["глу'пый","tonto",19],["пья'ный","borracho",20]
];
const AGROUPS=[
 {id:"yj",t:"-ый (terminación sin acento)",e:["-ый","-ая","-ое","-ые"]},
 {id:"oj",t:"-о'й (terminación acentuada)",e:["-о'й","-а'я","-о'е","-ы'е / -и'е"]},
 {id:"kgh",t:"-кий / -гий / -хий",e:["-ий","-ая","-ое","-ие"]},
 {id:"zhsh",t:"-жий / -ший / -чий / -щий",e:["-ий","-ая","-ее","-ие"]},
 {id:"soft",t:"-ний (blandos)",e:["-ий","-яя","-ее","-ие"]}
];

/* Resumen por урок: [tema, explicación, ejemplo] */
const RES={
1:[["Э'то… Кто/что э'то?","Para presentar a alguien o algo. Кто? es para personas y animales; что?, para cosas.","Кто э'то? — Э'то Ива'н. Что э'то? — Э'то кни'га."],["Sin «ser» en presente","En presente el verbo «ser» no se dice.","Он ме'неджер. Она' студе'нтка."],["Pronombres personales","я, ты, он, она', оно', мы, вы, они'. Вы también es «usted».","Вы преподава'тель?"],["не…, а…","Niega una cosa y presenta la correcta.","Э'то не кот, а соба'ка."]],
2:[["Género","Masculino: termina en consonante o -й. Femenino: -а / -я. Neutro: -о / -е. Los terminados en -ь pueden ser de los dos: hay que aprenderlos.","стол, кни'га, сло'во; слова'рь (м.), тетра'дь (ж.)"],["Plural (masculino y femenino)","Se suma -ы. Después de к, г, х, ж, ш, ч, щ y en lugar de -я / -ь va -и.","студе'нт → студе'нты, кни'га → кни'ги, тетра'дь → тетра'ди"],["Где? здесь ≠ там, вот ≠ вон","здесь / там dicen dónde está. вот / вон señalan: «acá está», «allá está».","Где метро'? — Вон там."],["Pronombres como objeto","меня', тебя', его', её, нас, вас, их.","Как вас зову'т? — Меня' зову'т А'нна."],["Ско'лько? y Как?","Números para contar y preguntar precios. Как? se responde con хорошо', пло'хо, отли'чно.","Как дела'? — Хорошо', а у вас?"]],
3:[["У меня' есть…","Así se dice «tengo». Lo contrario es нет.","У тебя' есть соба'ка? — Да, есть."],["I conjugación en -ать","Sacás -ть y sumás -ю, -ешь, -ет, -ем, -ете, -ют.","де'лать: я де'лаю, ты де'лаешь, они' де'лают"],["и'ли / и… и…","и'ли elige entre dos; и… и… suma los dos.","Чай и'ли ко'фе? — И чай, и ко'фе."],["то'же","Para decir «también».","Я то'же так ду'маю."],["Dar una opinión","Я ду'маю, что… · к сча'стью ≠ к сожале'нию.","Я ду'маю, что э'то интере'сно."]],
4:[["Posesivos y Чей?","мой / моя' / моё / мои', твой…, наш…, ваш…; его', её, их no cambian.","Чей э'то телефо'н? — Мой."],["¿Dónde? Posiciones","сле'ва, спра'ва, наверху', внизу', сза'ди, впереди'.","Кни'га наверху'."],["а, и, но","и suma, а contrasta, но va contra lo esperado.","Я рабо'таю, а он отдыха'ет."],["Pregunta sin palabra interrogativa","Solo cambia la entonación.","Ты рабо'таешь?"],["де'лать + objeto","El objeto masculino o neutro de cosa queda igual.","Я де'лаю зада'ние."]],
5:[["Pasado","Infinitivo sin -ть + -л (él), -ла (ella), -ли (ellos y вы).","Он рабо'тал, она' рабо'тала, они' рабо'тали."],["снача'ла ≠ пото'м","Ordenan acciones.","Снача'ла я за'втракаю, пото'м рабо'таю."],["ещё ≠ уже'","«todavía» ≠ «ya».","Я уже' зна'ю. Я ещё не зна'ю."],["Días de la semana","понеде'льник, вто'рник, среда', четве'рг, пя'тница, суббо'та, воскресе'нье.","Сего'дня суббо'та."],["Nombre ruso","и'мя, о'тчество (nombre del padre + -ович / -овна), фами'лия.","Ива'н Петро'вич Смирно'в"]],
6:[["Más verbos de la I conjugación","Igual que де'лать: -ю, -ешь, -ет, -ем, -ете, -ют.","гуля'ть: я гуля'ю, они' гуля'ют"],["Как? Adverbios","Dicen cómo se hace algo: бы'стро, ме'дленно, гро'мко, ти'хо, краси'во.","Он говори'т ме'дленно."],["Где? в / на + -е","Para decir dónde está o pasa algo, la palabra suma -е.","в о'фисе, на рабо'те, в рестора'не"]],
7:[["Когда'?","у'тром, днём, ве'чером, но'чью; всегда', иногда', никогда' не.","Ве'чером я отдыха'ю."],["начина'ть / конча'ть","Empezar / terminar + objeto o infinitivo.","Я начина'ю рабо'тать в 9."],["Palabras de la misma familia","отдыха'ть → о'тдых, начина'ть → нача'ло.","Как о'тдых?"],["Oraciones compuestas","Con что, кто, где, когда' se arma una segunda parte.","Я зна'ю, где он рабо'тает."]],
8:[["У меня' был / была' / бы'ло / бы'ли","Pasado de «tengo»: concuerda con lo que tenías.","У меня' была' соба'ка."],["спаси'бо за… / извини'те за…","«Gracias por…», «perdón por…».","Спаси'бо за ко'фе! Извини'те за опозда'ние."],["Repaso de posesivos","мой, твой, наш, ваш.","Э'то на'ша фи'рма."]],
9:[["II conjugación","-ю / -у, -ишь, -ит, -им, -ите, -ят / -ат.","говори'ть: говорю', говори'шь, говоря'т"],["весь, вся, всё, все","«todo» concuerda con el sustantivo.","весь день, вся неде'ля"],["Causa y consecuencia","потому' что / так как (causa), поэ'тому (consecuencia).","Я до'ма, потому' что идёт дождь."],["Где? -е / -ии","Las palabras en -ия cambian a -ии.","в Росси'и, в Ита'лии"],["жить y ду'мать о…","жить: живу', живёшь, живу'т. ду'мать о + algo.","Где вы живёте?"],["Futuro de быть","бу'ду, бу'дешь, бу'дет, бу'дем, бу'дете, бу'дут.","За'втра я бу'ду до'ма."]],
10:[["Plural con excepciones","Algunos masculinos llevan -а' y otros -ья.","го'род → города', брат → бра'тья"],["Países y nacionalidades","Страна' y национа'льность.","Он италья'нец."],["не то'лько…, но и…","«no solo…, sino también…».","Не то'лько чай, но и ко'фе."],["Как ча'сто?","ча'сто ≠ ре'дко, всегда', иногда', обы'чно.","Я ча'сто гуля'ю."],["быть ≠ быва'ть","быва'ть habla de algo que pasa seguido.","Здесь ча'сто быва'ет дождь."]],
11:[["Adjetivos","Concuerdan con el sustantivo en género y número.","но'вый дом, но'вая кни'га, но'вое сло'во, но'вые дома'"],["Како'й? Кака'я? Како'е? Каки'е?","Preguntan cómo es algo.","Кака'я э'то кни'га? — Интере'сная."],["э'то ≠ э'тот","э'то presenta; э'тот / э'та / э'то / э'ти señala. э'тот ≠ тот.","Э'то кни'га. Э'та кни'га интере'сная."]],
12:[["Comparativo","бо'лее / ме'нее + adjetivo, o formas cortas: бо'льше, ме'ньше, лу'чше, ху'же.","Москва' бо'льше, чем Пари'ж."],["Superlativo","са'мый + adjetivo.","са'мый интере'сный фильм"],["кото'рый","Une dos oraciones.","Э'то друг, кото'рый живёт в Москве'."],["хоте'ть, мочь, до'лжен","хочу' / хо'чешь / хотя'т; могу' / мо'жешь / мо'гут; до'лжен / должна' / должны'.","Я хочу' спать. Я до'лжен рабо'тать."]],
13:[["II conjugación con cambio en «я»","Solo la forma de я cambia la consonante.","люби'ть → люблю', гото'вить → гото'влю"],["Acusativo","Femenino -а → -у, -я → -ю; masculino de cosa queda igual.","Я чита'ю кни'гу."],["Imperativo","Para pedir u ordenar.","Де'лай(те)! Говори'(те)! Дава'й(те) рабо'тать!"]],
14:[["Estilo indirecto","Contar lo que dice otro.","Он говори'т, что он за'нят."],["Negativos","никто' не, ничего' не, нигде' не, никогда' не.","Никто' не зна'ет."],["Caso preposicional: где?","в / на + -е.","Он живёт в Москве'."]],
15:[["в или на?","Con algunas palabras va на: на рабо'те, на по'чте, на вокза'ле.","Я на рабо'те."],["Excepciones con где?","-у acentuada (в саду', в лесу', на мосту') y -и (в тетра'ди).","Мы гуля'ем в саду'."],["о + preposicional","о ком? о чём?: обо мне, о тебе', о нём.","О чём вы мечта'ете?"],["писа'ть","пишу', пи'шешь, пи'шут.","Я пишу' письмо'."]],
16:[["Cambio д → ж","ви'деть → ви'жу, сиде'ть → сижу'.","Я ви'жу дом."],["Где? ≠ Куда'?","Где? es dónde está; куда'? es hacia dónde va.","Я в шко'ле. Я иду' в шко'лу."],["ждать","жду, ждёшь, ждут.","Я жду тебя'."],["идти' ≠ ходи'ть","идти': ahora, en una dirección. ходи'ть: seguido, ida y vuelta.","Я иду' домо'й. Я ча'сто хожу' в теа'тр."]],
17:[["идти' / ходи'ть (2)","También para la lluvia y la nieve.","Идёт дождь."],["что'бы","Para expresar finalidad.","Я учу' ру'сский, что'бы чита'ть кни'ги."]],
18:[["учи'ться, учи'ть, изуча'ть","учи'ться: estudiar en un lugar; учи'ть: aprender algo; изуча'ть: estudiar a fondo.","Я учу'сь в университе'те."],["знать ≠ уме'ть","знать: saber algo; уме'ть: saber hacer.","Я уме'ю гото'вить."],["Ско'лько? ≠ Како'й?","Números cardinales y ordinales.","Како'е сего'дня число'?"]],
19:[["Verbos en -ва-","Pierden -ва- en presente.","дава'ть → даю', встава'ть → встаю'"],["Как до'лго? ≠ Когда'?","всю неде'лю ≠ че'рез неде'лю ≠ неде'лю наза'д.","Я жил там всю зи'му."],["игра'ть во что / на чём","в + deporte; на + instrumento.","игра'ть в футбо'л, на гита'ре"]],
20:[["петь, пить, мыть","Cambian la raíz: пою', пью, мо'ю.","Я пью чай."],["есть","ем, ешь, ест, еди'м, еди'те, едя'т.","Что ты ешь?"],["Brindis","Я пью за…","Я пью за ва'ше здоро'вье!"]]
};

/* ================= v3: material nuevo =================
   Libros: a1 = Русский язык. 5 элементов A1 (Эсмантова); pp = Primeros pasos, уроки 9–11 (pp. 168–233);
   a2 = Русский язык. 5 элементов A2 (Эсмантова), visto hasta p. 48. */
const BOOKS=[
 {id:"a1",name:"5 элеме'нтов · A1",es:"Libro A1, lecciones 1–20",lessons:Array.from({length:20},(_,i)=>i+1),first:1},
 {id:"pp",name:"Primeros pasos · уроки 9\u2060–\u206011",es:"Manual de la profe: genitivo, dativo, instrumental y adjetivos",lessons:[9,10,11],first:9},
 {id:"a2",name:"5 элеме'нтов · A2",es:"Libro A2: repaso inicial y lecciones 21–40",lessons:[0].concat(Array.from({length:20},(_,i)=>i+21)),first:0}
];
const LESSON_LABEL=(b,n)=>b==="a2"&&n===0?"Repaso":"Урок "+n;

/* Lecciones de Primeros pasos y A2 (índice real + resumen extenso) */
const PP_LESSONS=[
 {n:9,p:"168–184",text:"Роди'тельный паде'ж (№ 2)",es:"El genitivo: de dónde, de quién, qué no hay, cuánto hay y las fechas.",
  g:["Отку'да? из + gen.","У кого' есть / нет кого' / чего'?","Мно'го, ма'ло, ско'лько + gen.","2, 3, 4 + gen. sing.; 5… + gen. pl.","Прилага'тельные: како'го? како'й?","Како'е сего'дня число'?","без, для, по'сле, о'коло, кро'ме, недалеко' от + gen."],
  talk:["Отку'да вы? — Я из Аргенти'ны.","У меня' нет маши'ны.","Сего'дня пе'рвое ма'я."]},
 {n:10,p:"185–206",text:"Да'тельный (№ 3) и твори'тельный (№ 5)",es:"El dativo (a quién) y el instrumental (con quién, con qué, en qué te convertís).",
  g:["Да'тельный паде'ж: кому'? чему'?","Местоиме'ния: мне, тебе', ему', ей, нам, вам, им","дать, показа'ть, подари'ть, объясни'ть, позвони'ть + кому'","Ко'свенная речь: сказа'ть кому', отве'тить кому', спроси'ть кого'","Мо'жно взять…? Возьми'те!","Твори'тельный паде'ж: с кем? с чем?","стать, рабо'тать + кем","занима'ться, интересова'ться, увлека'ться + чем","встре'титься, познако'миться, договори'ться + с кем"],
  talk:["Ната'ша дала' кни'гу Анто'ну.","Я позвони'л ма'ме.","Он хо'чет стать врачо'м.","Мы с дру'гом встре'тились на у'лице."]},
 {n:11,p:"207–226",text:"Прилага'тельные (повтори'тельный)",es:"Repaso de adjetivos: los cuatro tipos de terminación, adjetivo o adverbio, colores.",
  g:["Како'й? кака'я? како'е? каки'е?","Тип 1: -ый / -ой · тип 2: -кий, -гий, -хий · тип 3: -жий, -ший, -чий, -щий · тип 4: -ний","Прилага'тельное и'ли наре'чие: како'й? ↔ как?","Цвета'","са'мый + прилага'тельное"],
  talk:["Э'то интере'сная кни'га.","На у'лице хо'лодно.","Ната'ша — са'мая краси'вая де'вушка."]}
];
const A2_LESSONS=[
 {n:0,p:"11–24",text:"Что вы по'мните?",es:"Repaso de todo el A1: preguntas, plural, léxico, adjetivos, acusativo, verbos, preposicional y sintaxis.",
  g:["Вопро'сы","Мно'жественное число'","Чей, како'й и'ли как? Кото'рый","Компарати'в и суперлати'в. Э'тот. Цвета'","Вини'тельный паде'ж: объе'кт, куда', когда', во ско'лько, как до'лго / ча'сто","Глаго'лы: гру'ппа I и II, present, past, imperative","Предло'жный паде'ж: где, о ком / чём, когда'","Национа'льность и язы'к","Си'нтаксис: е'сли, что'бы, потому' что, так как, поэ'тому","учи'ть, учи'ться, изуча'ть, уме'ть, быть"],
  talk:["Вы лю'бите путеше'ствовать? Где вы уже' бы'ли?"]},
 {n:21,p:"26–36",text:"День рожде'ния ба'бушки · Бомж",es:"Genitivo singular sin preposición: posesión, ausencia (нет, не было, не будет) y verbos que lo piden.",
  g:["Роди'тельный паде'ж ед. числа' без предло'гов","1) чей, како'й? (posesión)","2) нет — не' было — не бу'дет","бо'яться, зави'сеть от, жела'ть + gen.","Како'е сего'дня число'? (Пе'рвое февраля')"],
  talk:["Чего' у вас нет? Чья э'то вещь?","Чего' вы бои'тесь?","Како'е сего'дня число'?"]},
 {n:22,p:"37–48",text:"Сосе'дка · Рок-звезда'",es:"Verbos de la II conjugación con cambio en «я», ver/mirar y oír/escuchar, y el acusativo de personas.",
  g:["Глаго'лы II спряже'ния с чередова'нием: т/ч, д/ж, с/ш, ст/щ — плати'ть, ви'деть, проси'ть, чи'стить","Ви'деть и'ли смотре'ть, слы'шать и'ли слу'шать","Люби'ть, гото'вить, спать (повторе'ние)","Одушевлённый объе'кт: вини'тельный паде'ж ед. ч. (кого'?)","всё ещё ≠ бо'льше не + глаго'л"],
  talk:["Что вы лю'бите? Что вы хорошо' гото'вите?","Вы ча'сто чи'стите о'бувь?","Всё ещё ≠ бо'льше не."]},
 {n:23,p:"49–55",text:"Суббо'тнее у'тро",es:"Lo que estás viendo ahora: verbos de la I conjugación con cambio de consonante.",
  g:["Глаго'лы I спряже'ния с чередова'нием: с/ш, з/ж, к/ч, ск/щ — писа'ть, ре'зать, пла'кать, иска'ть","Глаго'лы стира'ть, реша'ть"],talk:["Я пла'чу, когда' ре'жу лук."]}
];
for(let n=24;n<=40;n++)A2_LESSONS.push({n,p:"",text:"",es:"",g:[],talk:[]});
const A2_PAGES={24:"56–72",25:"73–89",26:"94–106",27:"107–123",28:"124–129",29:"130–145",30:"146–159",31:"164–175",32:"176–189",33:"190–207",34:"208–223",35:"224–235",36:"240–248",37:"249–259",38:"260–271",39:"272–285",40:"286–296"};
A2_LESSONS.forEach(l=>{if(!l.p)l.p=A2_PAGES[l.n]});

/* Resumen extenso: [tema, explicación en castellano, [ejemplos en ruso]] */
const RES2={
 "pp9":[["Отку'да? из + genitivo","Para decir de dónde sos o de dónde venís se usa из + genitivo. La terminación cambia: -а / -я para masculino y neutro, -ы / -и para femenino.",["Я из Аргенти'ны.","Он из Ло'ндона.","Она' из Москвы'."]],
  ["У кого' есть / нет…","«Tener» es у + genitivo de la persona. Si no tenés algo, lo que falta también va en genitivo: нет + genitivo.",["У бра'та есть маши'на.","У меня' нет маши'ны.","В ко'мнате нет телеви'зора."]],
  ["Cantidad: мно'го, ма'ло, ско'лько","Después de palabras de cantidad va el genitivo. Con 2, 3 y 4 el genitivo singular; desde 5, el genitivo plural.",["У меня' мно'го друзе'й.","два челове'ка, пять челове'к","Я был в теа'тре два ра'за."]],
  ["Adjetivos en genitivo","El adjetivo acompaña al sustantivo: -ого / -его para masculino y neutro, -ой / -ей para femenino.",["У меня' нет ста'ршего бра'та.","Э'то а'дрес мое'й ру'сской подру'ги."]],
  ["Fechas","El día es un ordinal neutro y el mes va en genitivo.",["Сего'дня шесто'е ноября'.","Я роди'лась два'дцать второ'го а'вгуста."]],
  ["Preposiciones con genitivo","без (sin), для (para), по'сле (después de), о'коло (junto a), кро'ме (excepto), недалеко' от (cerca de).",["Чай без са'хара.","По'сле уро'ка я гуля'ю.","Магази'н недалеко' от до'ма."]]],
 "pp10":[["Dativo: кому'? чему'?","El dativo marca a quién le das, decís o mostrás algo. Masculino y neutro: -у / -ю; femenino: -е (y -и para -ия y -ь); plural: -ам / -ям.",["Ви'ктор пи'шет письмо' бра'ту.","Ма'ма подари'ла су'мку Ле'не.","Он позвони'л роди'телям."]],
  ["Pronombres en dativo","мне, тебе', ему', ей, нам, вам, им.",["Дай мне, пожа'луйста, ру'чку.","Я ему' позвони'л."]],
  ["Verbos con dativo","дать, показа'ть, подари'ть, объясни'ть + что? кому'?; позвони'ть + кому'?; сказа'ть, отве'тить + кому'?",["Анто'н дал Ви'ктору ка'рту.","Ната'ша сказа'ла Ви'ктору, что за'втра бу'дет экску'рсия."]],
  ["Estilo indirecto","Para contar lo que dijo otro: сказа'л(а) кому', что…; спроси'л(а) кого'; отве'тил(а) кому'.",["Андре'й спроси'л Ири'ну, что она' бу'дет де'лать.","Ири'на отве'тила Андре'ю, что она' бу'дет занима'ться."]],
  ["Instrumental: с кем? с чем?","Compañía o algo que acompaña. Masculino y neutro: -ом / -ем; femenino: -ой / -ей (y -ью para -ь); plural: -ами / -ями.",["Я ходи'л в теа'тр с дру'гом.","Макаро'ны с сы'ром.","Мы с подру'гой встре'тились на у'лице."]],
  ["Instrumental con verbos","стать, рабо'тать + кем (profesión); занима'ться, интересова'ться, увлека'ться + чем (actividad o interés).",["Он хо'чет стать врачо'м.","Я занима'юсь ру'сским языко'м.","Она' интересу'ется иску'сством."]],
  ["Adjetivos en instrumental","-ым / -им para masculino y neutro; -ой / -ей para femenino.",["с мои'м но'вым ру'сским дру'гом","с мое'й ру'сской подру'гой"]]],
 "pp11":[["Cuatro tipos de adjetivo","Tipo 1: -ый / -ой (но'вый, молодо'й). Tipo 2: después de к, г, х (ма'ленький, большо'й). Tipo 3: después de ж, ш, ч, щ (хоро'ший). Tipo 4: blandos en -ний (после'дний).",["но'вая кни'га, ма'ленькое окно', хоро'шие друзья', после'дняя страни'ца"]],
  ["Adjetivo o adverbio","El adjetivo responde a како'й? y acompaña a un sustantivo. El adverbio responde a как? y acompaña a un verbo, o describe una situación.",["Оле'г — хоро'ший студе'нт. Он хорошо' у'чится.","На у'лице хо'лодно.","Мы смотре'ли фильм. Бы'ло интере'сно."]],
  ["са'мый","Para decir «el más…».",["Ната'ша — са'мая краси'вая де'вушка."]],
  ["Colores","чёрный, бе'лый, кра'сный, жёлтый, зелёный, си'ний, голубо'й, се'рый, кори'чневый.",["Како'й цвет? — Зелёный.","У неё голубы'е глаза'."]]],
 "a20":[["Preguntas y plural","Repaso de cómo armar preguntas y del plural, incluidas las excepciones (друзья', города', лю'ди).",["Куда' ходи'ли друзья'? — В теа'тр."]],
  ["Acusativo: objeto, dirección y tiempo","El acusativo marca el objeto (что? кого'?), la dirección con в / на (куда'?) y el tiempo: в + día de la semana, че'рез / наза'д, весь / ка'ждый.",["Я приглаша'ю вас в теа'тр.","В суббо'ту мы отдыха'ем.","Че'рез неде'лю у нас экза'мены.","Ка'ждое воскресе'нье мы на да'че."]],
  ["Verbos tipo I y II","Presente, pasado e imperativo de los verbos que ya viste (хоте'ть, мочь, есть, писа'ть, спать, учи'ть…).",["Я хочу', ты хо'чешь, они' хотя'т.","Пиши'! Спи!"]],
  ["Preposicional: где, о ком / о чём, когда'","в / на + -е para lugares, о + preposicional para temas, в + mes o año para fechas.",["Я была' в Шве'йцарии и во Фра'нции.","Мы говори'м о пого'де.","В ма'е у нас экза'мены."]],
  ["Sintaxis","е'сли (si), что'бы (para que), потому' что / так как (porque), поэ'тому (por eso).",["Е'сли у меня' есть вре'мя, я за'втракаю."]]],
 "a221":[["Genitivo: posesión y atributo","Para decir de quién es algo (чей?) o qué tipo de cosa es (како'й?), el dueño va en genitivo.",["Э'то кни'га студе'нта.","Э'то ка'рта Росси'и.","Чья э'то кни'га? — А'нны."]],
  ["Formas del genitivo singular","Masculino y neutro: -а / -я (стола', музе'я, мо'ря). Femenino: -ы / -и (ко'мнаты, ку'хни, две'ри). Después de к, г, х, ж, ш, ч, щ va -и (кни'ги).",["Здесь нет сосе'да и сосе'дки.","Здесь нет сту'ла и крова'ти."]],
  ["нет — не' было — не бу'дет","Ausencia en presente, pasado y futuro: siempre con genitivo. El verbo no cambia: не' было, не бу'дет.",["У нас нет да'чи.","Ра'ньше у нас не' было да'чи.","За'втра меня' не бу'дет до'ма."]],
  ["Verbos con genitivo","боя'ться (tener miedo de): бою'сь, бои'шься, боя'тся. зави'сеть от (depender de): зави'шу, зави'сишь. жела'ть (desear): Жела'ю уда'чи!",["Мышь бои'тся кота'.","Э'то зави'сит от ситуа'ции.","Жела'ю сча'стья!"]],
  ["Fechas","Ordinal neutro + mes en genitivo.",["Сего'дня пе'рвое февраля'.","Вчера' бы'ло три'дцать пе'рвое ма'я."]]],
 "a222":[["II conjugación con cambio en «я»","Solo la forma de я cambia: д → ж, т → ч, с → ш, ст → щ. El resto sigue la II conjugación.",["ви'деть → я ви'жу, ты ви'дишь","плати'ть → я плачу', ты пла'тишь","проси'ть → я прошу', ты про'сишь","чи'стить → я чи'щу, ты чи'стишь"]],
  ["Con qué caso va cada verbo","ви'деть y чи'стить + acusativo; плати'ть за + acusativo; проси'ть + кого' + infinitivo, o у кого' + qué.",["Я пла'чу за маши'ну ты'сячу.","Я прошу' вас быть здесь.","Я прошу' у вас кни'гу."]],
  ["ви'деть ≠ смотре'ть, слы'шать ≠ слу'шать","ви'деть y слы'шать: percibir o poder hacerlo. смотре'ть y слу'шать: prestar atención a propósito.",["Я ничего' не ви'жу.","Я смотрю' фильм.","Ты слы'шишь? — Я слу'шаю му'зыку."]],
  ["Acusativo de personas (кого'?)","Masculino animado: igual al genitivo (-а / -я). Femenino: -у / -ю, sea persona o cosa. Masculino de cosa: igual al nominativo.",["Я ви'жу бра'та.","Я люблю' сестру'.","Я ви'жу портре'т."]],
  ["всё ещё ≠ бо'льше не","всё ещё: algo que sigue pasando. бо'льше не: algo que ya no pasa.",["Они' всё ещё лю'бят друг дру'га.","Они' бо'льше не спо'рят об э'том."]]],
 "a223":[["I conjugación con cambio de consonante","Cambian en todas las formas del presente: писа'ть → пишу', пи'шешь; ре'зать → ре'жу; пла'кать → пла'чу; иска'ть → ищу'.",["Я пла'чу, когда' ре'жу лук."]]]
};

/* Ejemplos extra para el A1 (casos en uso) */
const RES_EXTRA={
 6:[["в / на + -е en uso","Con в se habla de un espacio cerrado; con на, de superficies, eventos y algunos lugares fijos.",["Я в о'фисе.","Он на рабо'те.","Кни'га на столе'."]]],
 8:[["за + acusativo en uso","спаси'бо за и извини'те за van con acusativo.",["Спаси'бо за по'мощь!","Извини'те за опозда'ние."]]],
 9:[["о + preposicional en uso","ду'мать о, говори'ть о: el tema va en preposicional.",["Я ду'маю о рабо'те.","Мы говори'м о Москве'."]]],
 13:[["Acusativo en uso","Femenino -а → -у, -я → -ю. Masculino de cosa no cambia.",["Я чита'ю кни'гу.","Я люблю' му'зыку.","Он покупа'ет стол."]]],
 14:[["Preposicional en uso","где? con в / на + -е.",["Мы живём в Буэ'нос-А'йресе.","Он рабо'тает на заво'де."]]],
 15:[["Excepciones en uso","Algunas palabras llevan -у acentuada: в саду', в лесу', на мосту', на полу'.",["Де'ти гуля'ют в саду'.","Кот лежи'т на полу'."]]],
 16:[["Где? ≠ Куда'? en uso","где? + preposicional (estar), куда'? + acusativo (ir).",["Я в шко'ле. — Я иду' в шко'лу.","Он на рабо'те. — Он идёт на рабо'ту."]]]
};

/* Vocabulario nuevo: [ruso|castellano] por libro y урок */
const VOC2={
 "pp9":"ба'нка|frasco, lata;буты'лка|botella;во'здух|aire;в при'нципе|en principio;без + gen.|sin;для + gen.|para;жени'х|novio (prometido);неве'ста|novia (prometida);жето'н|ficha;игру'шка|juguete;календа'рь|calendario;ковёр|alfombra;кошелёк|billetera;кро'ме + gen.|excepto;курс (до'ллара)|cotización (del dólar);ку'рсы ру'сского языка'|curso de ruso;кусо'к|pedazo;лине'йка|regla;невозмо'жно|es imposible;недалеко' от + gen.|cerca de;о'коло + gen.|junto a;оконча'ние|terminación;паке'т|bolsa;пока' (ещё)|por ahora;по'сле + gen.|después de;рези'нка|goma de borrar;рюкза'к|mochila;салфе'тка|servilleta;столи'ца|capital;тепе'рь|ahora;хозя'ин|dueño",
 "pp10":"ветчина'|jamón;вкус|sabor, gusto;горчи'ца|mostaza;грибы'|hongos;диза'йнер|diseñador;диплома'т|diplomático;иску'сство|arte;ме'жду + instr.|entre;мо'да|moda;оре'х|nuez;пе'ние|canto;перево'дчица|traductora;пла'вание|natación;пода'рок|regalo;поли'тик|político;приме'рно|aproximadamente;ра'зница|diferencia;рисова'ние|dibujo;ря'дом с + instr.|al lado de;случа'йно|por casualidad;стюарде'сса|azafata;та'нцы|baile;что'бы|para que;Возьми'те!|¡Tome!",
 "pp11":"авиака'сса|venta de pasajes aéreos;бе'лые но'чи|noches blancas;беспла'тно|gratis;бли'зко|cerca;ва'нная|baño;во'лосы|pelo;говя'дина|carne de vaca;свини'на|carne de cerdo;из + gen.|de (material, origen);ка'сса|caja;кольцо'|anillo;маршру'тка|combi;меню'|menú;наоборо'т|al revés;не'бо|cielo;о'блако|nube;обяза'тельно|sin falta;осторо'жно|con cuidado;по'рция|porción;прогно'з пого'ды|pronóstico del tiempo;про'сто|simplemente;райо'н|barrio;самостоя'тельно|por tu cuenta;свобо'дно|libremente, con fluidez;ско'льзко|resbaladizo;темно'|oscuro;трава'|pasto;фра'за|frase;цари'ца|zarina;цвет|color;шашлы'к|brochette;шу'мно|hay ruido;Ну и как?|¿Y qué tal?",
 "a20":"",
 "a221":"бомж|persona en situación de calle;от + gen.|de, desde;кусо'к|pedazo;часть (ж.)|parte;зе'ркало|espejo;Уда'чи!|¡Suerte!;Успе'ха!|¡Éxitos!;Сча'стья!|¡Felicidades!",
 "a222":"бое'вик|película de acción;всё ещё ≠ бо'льше не|todavía ≠ ya no;доста'точно|suficiente;звезда'|estrella;зуб — зу'бы|diente — dientes;куми'р|ídolo;(не)далеко'|(no) lejos;шум|ruido;о'бувь|calzado"
};

/* Verbos nuevos: [inf, castellano, libro, урок, grupo, formas?, aspecto?] */
const VERBS2=[
 ["рисова'ть","dibujar","pp",9,"OVA"],
 ["дать","dar","pp",10,"PF","дам,дашь,даст,дади'м,дади'те,даду'т"],
 ["показа'ть","mostrar","pp",10,"PF","покажу',пока'жешь,пока'жет,пока'жем,пока'жете,пока'жут"],
 ["подари'ть","regalar","pp",10,"PF","подарю',пода'ришь,пода'рит,пода'рим,пода'рите,пода'рят"],
 ["объясни'ть","explicar","pp",10,"PF","объясню',объясни'шь,объясни'т,объясни'м,объясни'те,объясня'т"],
 ["позвони'ть","llamar por teléfono","pp",10,"PF","позвоню',позвони'шь,позвони'т,позвони'м,позвони'те,позвоня'т"],
 ["сказа'ть","decir","pp",10,"PF","скажу',ска'жешь,ска'жет,ска'жем,ска'жете,ска'жут"],
 ["отве'тить","responder","pp",10,"PF","отве'чу,отве'тишь,отве'тит,отве'тим,отве'тите,отве'тят"],
 ["заказа'ть","pedir, encargar","pp",10,"PF","закажу',зака'жешь,зака'жет,зака'жем,зака'жете,зака'жут"],
 ["встре'титься","encontrarse (con alguien)","pp",10,"PF","встре'чусь,встре'тишься,встре'тится,встре'тимся,встре'титесь,встре'тятся"],
 ["познако'миться","conocer a alguien","pp",10,"PF","познако'млюсь,познако'мишься,познако'мится,познако'мимся,познако'митесь,познако'мятся"],
 ["договори'ться","ponerse de acuerdo","pp",10,"PF","договорю'сь,договори'шься,договори'тся,договори'мся,договори'тесь,договоря'тся"],
 ["интересова'ться","interesarse por","pp",10,"OVA","интересу'юсь,интересу'ешься,интересу'ется,интересу'емся,интересу'етесь,интересу'ются"],
 ["увлека'ться","apasionarse por","pp",10,"I","увлека'юсь,увлека'ешься,увлека'ется,увлека'емся,увлека'етесь,увлека'ются"],
 ["занима'ться","dedicarse a, estudiar","pp",10,"I","занима'юсь,занима'ешься,занима'ется,занима'емся,занима'етесь,занима'ются"],
 ["пла'вать","nadar","pp",10,"I"],
 ["стать","convertirse en","pp",10,"PF","ста'ну,ста'нешь,ста'нет,ста'нем,ста'нете,ста'нут"],
 ["рекомендова'ть","recomendar","pp",11,"OVA"],
 ["закрыва'ться","cerrar (un negocio)","pp",11,"I","закрыва'юсь,закрыва'ешься,закрыва'ется,закрыва'емся,закрыва'етесь,закрыва'ются"],
 ["останови'ть","detener","pp",11,"PF","остановлю',остано'вишь,остано'вит,остано'вим,остано'вите,остано'вят"],
 ["провести' (вре'мя)","pasar (el tiempo)","pp",11,"PF","проведу',проведёшь,проведёт,проведём,проведёте,проведу'т"],
 ["боя'ться","tener miedo de (+ gen.)","a2",21,"II","бою'сь,бои'шься,бои'тся,бои'мся,бои'тесь,боя'тся"],
 ["зави'сеть от","depender de (+ gen.)","a2",21,"IIa","зави'шу,зави'сишь,зави'сит,зави'сим,зави'сите,зави'сят"],
 ["жела'ть","desear (+ gen.)","a2",21,"I"],
 ["плати'ть","pagar","a2",22,"IIa","плачу',пла'тишь,пла'тит,пла'тим,пла'тите,пла'тят"],
 ["проси'ть","pedir","a2",22,"IIa","прошу',про'сишь,про'сит,про'сим,про'сите,про'сят"],
 ["чи'стить","limpiar, pelar","a2",22,"IIa","чи'щу,чи'стишь,чи'стит,чи'стим,чи'стите,чи'стят"],
 ["слы'шать","oír","a2",22,"II","слы'шу,слы'шишь,слы'шит,слы'шим,слы'шите,слы'шат"],
 ["капри'зничать","hacer berrinches","a2",22,"I"],
 ["писа'ть","escribir","a2",23,"X","пишу',пи'шешь,пи'шет,пи'шем,пи'шете,пи'шут"],
 ["ре'зать","cortar","a2",23,"X","ре'жу,ре'жешь,ре'жет,ре'жем,ре'жете,ре'жут"],
 ["пла'кать","llorar","a2",23,"X","пла'чу,пла'чешь,пла'чет,пла'чем,пла'чете,пла'чут"],
 ["иска'ть","buscar","a2",23,"X","ищу',и'щешь,и'щет,и'щем,и'щете,и'щут"],
 ["стира'ть","lavar (ropa)","a2",23,"I"],
 ["реша'ть","resolver, decidir","a2",23,"I"],
 ["убира'ть","ordenar, limpiar","a2",23,"I"]
];
const PAST2={"дать":"дал,дала',да'ли","встретиться":"встре'тился,встре'тилась,встре'тились","провести (время)":"провёл,провела',провели'","бояться":"боя'лся,боя'лась,боя'лись","стать":"стал,ста'ла,ста'ли"};

/* Adjetivos nuevos: [masc, castellano, libro, урок] */
const ADJ2=[
 ["беспла'тный","gratuito","pp",11],["бы'стрый","rápido","pp",11],["ва'жный","importante","pp",10],["ве'жливый","amable, educado","pp",10],["вку'сный","rico","pp",11],["внима'тельный","atento","pp",10],["гла'вный","principal","pp",11],["знако'мый","conocido","pp",11],["золото'й","de oro","pp",11],["изве'стный","famoso","pp",11],["интере'сный","interesante","pp",11],["краси'вый","lindo","pp",11],["ме'дленный","lento","pp",11],["одина'ковый","igual, idéntico","pp",10],["о'пытный","experimentado","pp",11],["осторо'жный","cuidadoso","pp",11],["пра'вильный","correcto","pp",11],["прекра'сный","hermoso, excelente","pp",11],["просто'й","simple","pp",11],["са'мый","el más","pp",11],["серьёзный","serio","pp",11],["сме'лый","valiente","pp",11],["совреме'нный","moderno","pp",11],["солёный","salado","pp",11],["тёмный","oscuro","pp",11],["то'лстый","gordo, grueso","pp",11],["удо'бный","cómodo","pp",9],["хи'трый","astuto","pp",11],["ча'стый","frecuente","pp",11],["че'стный","honesto","pp",11],["аккура'тный","prolijo","pp",10],["мо'дный","de moda","pp",10],["о'стрый","picante, filoso","pp",10],["прия'тный","agradable","pp",10],["симпати'чный","simpático, lindo","pp",10],["лени'вый","perezoso","pp",11],["национа'льный","nacional","pp",11],["не'который","algún","pp",11],["серебряный","de plata","pp",11],["ча'стный","privado","pp",11],["гру'бый","grosero","pp",11],["ко'жаный","de cuero","pp",11],
 ["гро'мкий","fuerte (sonido)","pp",11],["жа'ркий","caluroso","pp",11],["коро'ткий","corto","pp",11],["мя'гкий","blando","pp",11],["ре'дкий","raro, poco común","pp",11],["сла'дкий","dulce","pp",11],["ти'хий","silencioso","pp",11],["то'нкий","fino","pp",11],["у'зкий","angosto","pp",11],["широ'кий","ancho","pp",11],
 ["мла'дший","menor (hermano)","pp",11],["све'жий","fresco","pp",11],["ста'рший","mayor (hermano)","pp",11],
 ["дома'шний","casero","pp",11],["зи'мний","de invierno","pp",11],["ле'тний","de verano","pp",11],["ра'нний","temprano","pp",11],["си'ний","azul oscuro","pp",11],
 ["чёрный","negro","pp",11],["бе'лый","blanco","pp",11],["кра'сный","rojo","pp",11],["жёлтый","amarillo","pp",11],["зелёный","verde","pp",11],["голубо'й","celeste","pp",11],["се'рый","gris","pp",11],["кори'чневый","marrón","pp",11],
 ["го'рдый","orgulloso","a2",22],["капри'зный","caprichoso","a2",22],["настоя'щий","verdadero","a2",22],["сло'жный","complicado","a2",22],["це'лый","entero","a2",22]
];

/* Casos: explicación, usos, preposiciones y ejemplos (Primeros pasos pp. 227–233; A2 pp. 304–305) */
const CASES=[
 {id:"nom",n:1,ru:"Имени'тельный",es:"Nominativo",q:"кто? что?",
  use:"Es la forma del diccionario. Marca quién hace la acción (el sujeto) y también lo que algo es.",
  uses:[["Sujeto","Ви'ктор чита'ет кни'гу."],["Qué es algo o alguien","Ви'ктор — врач."],["Con «se llama»","Как называ'ется э'та кни'га?"]],
  preps:"—",verbs:"—"},
 {id:"gen",n:2,ru:"Роди'тельный",es:"Genitivo",q:"кого'? чего'? чей? како'й? отку'да?",
  use:"Indica de quién es algo, qué falta, cuánto hay, de dónde venís y las fechas.",
  uses:[["Posesión: ¿de quién?","Э'то слова'рь О'льги."],["Ausencia: нет, не' было, не бу'дет","У Ви'ктора нет маши'ны."],["Cantidad: много, мало, 2–4, 5…","У меня' мно'го друзе'й. Два бра'та."],["Origen: из, от","Пьер из Фра'нции."],["Fecha","Сего'дня пе'рвое ма'я."],["Verbos: боя'ться, зави'сеть от, жела'ть","Мышь бои'тся кота'."]],
  preps:"у, из, без, по'сле, для, о'коло, кро'ме, недалеко' от, от, до, с (desde)",verbs:"боя'ться, зави'сеть от, жела'ть"},
 {id:"dat",n:3,ru:"Да'тельный",es:"Dativo",q:"кому'? чему'?",
  use:"Indica a quién va dirigida una acción: a quién le das, decís, mostrás o llamás. También la edad y lo que alguien necesita.",
  uses:[["Destinatario","Ви'ктор пи'шет письмо' бра'ту."],["Edad","Ви'ктору два'дцать лет."],["Necesidad: ну'жно, на'до","Ви'ктору ну'жно позвони'ть ма'ме."],["Dirección hacia una persona: к","Я иду' к дру'гу."]],
  preps:"по, к, благодаря'",verbs:"дать, показа'ть, подари'ть, объясни'ть, позвони'ть, сказа'ть, отве'тить"},
 {id:"acc",n:4,ru:"Вини'тельный",es:"Acusativo",q:"кого'? что? куда'? когда'?",
  use:"Marca el objeto directo, hacia dónde vas (con в / на) y muchas expresiones de tiempo.",
  uses:[["Objeto directo","Анто'н чита'ет кни'гу."],["Persona como objeto (masc. = genitivo)","Ви'ктор встре'тил Анто'на."],["Dirección: куда'?","Ви'ктор ходи'л в апте'ку."],["Tiempo: в + día, че'рез, наза'д, весь, ка'ждый","Мы бы'ли на стадио'не в суббо'ту."],["Compensación: за","Спаси'бо за по'мощь!"]],
  preps:"в, на (dirección y tiempo), за, через, под",verbs:"изуча'ть, встре'тить, спроси'ть, пригласи'ть, ви'деть, слы'шать, люби'ть"},
 {id:"ins",n:5,ru:"Твори'тельный",es:"Instrumental",q:"(с) кем? (с) чем?",
  use:"Indica con quién o con qué, en qué te convertís o de qué trabajás, y aquello que te interesa o a lo que te dedicás.",
  uses:[["Compañía: с","Ви'ктор познако'мился с Анто'ном."],["Algo que acompaña","Он лю'бит макаро'ны с сы'ром."],["Profesión: стать, рабо'тать","Анто'н хо'чет стать врачо'м."],["Interés o actividad","Анто'н занима'ется футбо'лом."],["Ubicación: ря'дом с, ме'жду, над, под, пе'ред, за","Остано'вка ря'дом с до'мом."]],
  preps:"с, ря'дом с, ме'жду, над, под, пе'ред, за",verbs:"встре'титься, договори'ться, занима'ться, интересова'ться, увлека'ться, рабо'тать, стать"},
 {id:"pre",n:6,ru:"Предло'жный",es:"Preposicional",q:"где? о ком? о чём? когда'?",
  use:"Indica dónde está algo (con в / на), de qué o de quién se habla (con о) y algunas fechas.",
  uses:[["Lugar: где?","Ви'ктор был в А'нглии."],["Tema: о ком? о чём?","Анто'н ду'мает о сестре' и бра'те."],["Instrumento musical: игра'ть на","Мари'на игра'ет на гита'ре."],["Transporte: на","О'льга е'здит на рабо'ту на маши'не."],["Tiempo: в + mes o año","В ма'е у нас экза'мены."]],
  preps:"в, на, о (об, обо), при",verbs:"учи'ться, жить, разгова'ривать, ду'мать о, говори'ть о, мечта'ть о"}
];
/* Palabras de ejemplo que cambian por caso: [nom, gen, dat, acc, ins, pre] sing y plural */
const DECL=[
 {w:"студе'нт",g:"м.",note:"masculino, consonante (animado)",
  s:["студе'нт","студе'нта","студе'нту","студе'нта","студе'нтом","о студе'нте"],p:["студе'нты","студе'нтов","студе'нтам","студе'нтов","студе'нтами","о студе'нтах"]},
 {w:"музе'й",g:"м.",note:"masculino en -й (cosa)",
  s:["музе'й","музе'я","музе'ю","музе'й","музе'ем","о музе'е"],p:["музе'и","музе'ев","музе'ям","музе'и","музе'ями","о музе'ях"]},
 {w:"преподава'тель",g:"м.",note:"masculino en -ь",
  s:["преподава'тель","преподава'теля","преподава'телю","преподава'теля","преподава'телем","о преподава'теле"],p:["преподава'тели","преподава'телей","преподава'телям","преподава'телей","преподава'телями","о преподава'телях"]},
 {w:"сло'во",g:"ср.",note:"neutro en -о",
  s:["сло'во","сло'ва","сло'ву","сло'во","сло'вом","о сло'ве"],p:["слова'","слов","слова'м","слова'","слова'ми","о слова'х"]},
 {w:"мо'ре",g:"ср.",note:"neutro en -е",
  s:["мо'ре","мо'ря","мо'рю","мо'ре","мо'рем","о мо'ре"],p:["моря'","море'й","моря'м","моря'","моря'ми","о моря'х"]},
 {w:"зда'ние",g:"ср.",note:"neutro en -ие",
  s:["зда'ние","зда'ния","зда'нию","зда'ние","зда'нием","о зда'нии"],p:["зда'ния","зда'ний","зда'ниям","зда'ния","зда'ниями","о зда'ниях"]},
 {w:"кни'га",g:"ж.",note:"femenino en -а (después de г: -и)",
  s:["кни'га","кни'ги","кни'ге","кни'гу","кни'гой","о кни'ге"],p:["кни'ги","книг","кни'гам","кни'ги","кни'гами","о кни'гах"]},
 {w:"неде'ля",g:"ж.",note:"femenino en -я",
  s:["неде'ля","неде'ли","неде'ле","неде'лю","неде'лей","о неде'ле"],p:["неде'ли","неде'ль","неде'лям","неде'ли","неде'лями","о неде'лях"]},
 {w:"аудито'рия",g:"ж.",note:"femenino en -ия",
  s:["аудито'рия","аудито'рии","аудито'рии","аудито'рию","аудито'рией","об аудито'рии"],p:["аудито'рии","аудито'рий","аудито'риям","аудито'рии","аудито'риями","об аудито'риях"]},
 {w:"тетра'дь",g:"ж.",note:"femenino en -ь",
  s:["тетра'дь","тетра'ди","тетра'ди","тетра'дь","тетра'дью","о тетра'ди"],p:["тетра'ди","тетра'дей","тетра'дям","тетра'ди","тетра'дями","о тетра'дях"]}
];
/* Terminaciones (Primeros pasos p. 227 y p. 230; adjetivos p. 231) */
const ENDS={
 sing:{m:["— / -й / -ь","-а / -я","-у / -ю","= nom. (cosa) / = gen. (persona)","-ом / -ем","-е"],n:["-о / -е / -ие","-а / -я","-у / -ю","= nom.","-ом / -ем","-е / -ии"],f:["-а / -я / -ия / -ь","-ы / -и","-е / -ии / -и","-у / -ю / -ь","-ой / -ей / -ью","-е / -ии / -и"]},
 pl:["-ы / -и / -а","-ов / -ев / -ей / —","-ам / -ям","= nom. (cosa) / = gen. (persona)","-ами / -ями","-ах / -ях"],
 adj:{m:["-ый / -ой / -ий","-ого / -его","-ому / -ему","= nom. / = gen.","-ым / -им","-ом / -ем"],n:["-ое / -ее","-ого / -его","-ому / -ему","-ое / -ее","-ым / -им","-ом / -ем"],f:["-ая / -яя","-ой / -ей","-ой / -ей","-ую / -юю","-ой / -ей","-ой / -ей"],pl:["-ые / -ие","-ых / -их","-ым / -им","= nom. / = gen.","-ыми / -ими","-ых / -их"]}
};
const ADJ_DECL={w:"но'вый",m:["но'вый","но'вого","но'вому","но'вый / но'вого","но'вым","о но'вом"],n:["но'вое","но'вого","но'вому","но'вое","но'вым","о но'вом"],f:["но'вая","но'вой","но'вой","но'вую","но'вой","о но'вой"],pl:["но'вые","но'вых","но'вым","но'вые / но'вых","но'выми","о но'вых"]};
const PRONS={h:["я","ты","он","она'","мы","вы","они'"],rows:[["меня'","тебя'","его' (у него')","её (у неё)","нас","вас","их (у них)"],["мне","тебе'","ему' (к нему')","ей (к ней)","нам","вам","им (к ним)"],["меня'","тебя'","его'","её","нас","вас","их"],["мной","тобо'й","им (с ним)","ей (с ней)","на'ми","ва'ми","и'ми (с ни'ми)"],["обо мне","о тебе'","о нём","о ней","о нас","о вас","о них"]]};

/* Consignas del reto diario: sacadas de lo ya visto, con su página */
const PROMPTS=[
 {id:"r1",b:"a2",l:21,p:32,ru:"Кого' и'ли чего' вы боя'лись в де'тстве? А сейча'с?",es:"¿A quién o a qué le tenías miedo de chica? ¿Y ahora?",focus:"Genitivo con боя'ться"},
 {id:"r2",b:"a2",l:21,p:35,ru:"От чего' вы зави'сите? Что зави'сит от вас?",es:"¿De qué dependés? ¿Qué depende de vos?",focus:"зави'сеть от + genitivo"},
 {id:"r3",b:"a2",l:21,p:33,ru:"Когда' у вас обы'чно не быва'ет вре'мени? Почему'?",es:"¿Cuándo no tenés tiempo, en general? ¿Por qué?",focus:"нет / не' было / не бу'дет + genitivo"},
 {id:"r4",b:"a2",l:21,p:34,ru:"Напиши'те коне'ц исто'рии «Бомж»: почему' у него' тепе'рь ничего' нет?",es:"Escribí el final de la historia «Бомж»: ¿por qué ahora no tiene nada?",focus:"не' было, нет + genitivo; pasado"},
 {id:"r5",b:"a2",l:21,p:33,ru:"Что в ми'ре бы'ло и чего' не' было, когда' вас не' было?",es:"¿Qué había y qué no había en el mundo antes de que nacieras?",focus:"не' было + genitivo"},
 {id:"r6",b:"a2",l:22,p:38,ru:"За что вы мо'жете плати'ть до'рого? За что лю'ди не должны' плати'ть?",es:"¿Por qué cosas podés pagar caro? ¿Por qué cosas no debería pagar la gente?",focus:"плати'ть за + acusativo"},
 {id:"r7",b:"a2",l:22,p:40,ru:"Что вы про'сите у дру'га, у колле'ги и у преподава'теля?",es:"¿Qué le pedís a un amigo, a un colega y a tu profesora?",focus:"проси'ть у + genitivo"},
 {id:"r8",b:"a2",l:22,p:43,ru:"Что вы смо'трите по телеви'зору? Каку'ю му'зыку вы слу'шаете?",es:"¿Qué mirás en la tele? ¿Qué música escuchás?",focus:"смотре'ть / слу'шать + acusativo"},
 {id:"r9",b:"a2",l:22,p:47,ru:"У вас есть куми'р и'ли люби'мый певе'ц, люби'мая гру'ппа? Расскажи'те.",es:"¿Tenés un ídolo, un cantante o una banda favorita? Contá.",focus:"Acusativo de personas"},
 {id:"r10",b:"a2",l:22,p:48,ru:"Что вы ра'ньше де'лали, но бо'льше не де'лаете? Что вы всё ещё лю'бите де'лать?",es:"¿Qué hacías antes y ya no hacés? ¿Qué todavía te gusta hacer?",focus:"всё ещё ≠ бо'льше не"},
 {id:"r11",b:"a2",l:0,p:23,ru:"Вы лю'бите путеше'ствовать? Где вы уже' бы'ли?",es:"¿Te gusta viajar? ¿Dónde estuviste?",focus:"Preposicional: в / на + -е"},
 {id:"r12",b:"a2",l:0,p:17,ru:"Что вы лю'бите де'лать в свой день рожде'ния?",es:"¿Qué te gusta hacer el día de tu cumpleaños?",focus:"Acusativo: objeto y tiempo"},
 {id:"r13",b:"pp",l:9,p:182,ru:"Расскажи'те о себе': где вы живёте? Э'то удо'бное ме'сто? Что есть и чего' нет в ва'шей ко'мнате?",es:"Contá sobre vos: dónde vivís, si es un lugar cómodo, qué hay y qué no hay en tu cuarto.",focus:"Genitivo: нет + gen.; adjetivos"},
 {id:"r14",b:"pp",l:10,p:187,ru:"Что вы хоти'те подари'ть ма'ме, дру'гу и подру'ге? Почему'?",es:"¿Qué le querés regalar a tu mamá, a un amigo y a una amiga? ¿Por qué?",focus:"Dativo: кому'?"},
 {id:"r15",b:"pp",l:10,p:205,ru:"Чем вы интересу'етесь? Кем вы хоти'те стать?",es:"¿Qué te interesa? ¿En qué te querés convertir?",focus:"Instrumental: чем? кем?"},
 {id:"r16",b:"pp",l:10,p:204,ru:"С кем вы ча'сто встреча'етесь? Где и когда' вы встреча'етесь?",es:"¿Con quién te encontrás seguido? ¿Dónde y cuándo?",focus:"Instrumental: с кем?"},
 {id:"r17",b:"pp",l:11,p:213,ru:"Ва'ша кварти'ра больша'я и'ли ма'ленькая? Опиши'те её.",es:"¿Tu departamento es grande o chico? Describilo.",focus:"Adjetivos: concordancia"},
 {id:"r18",b:"pp",l:11,p:214,ru:"Опиши'те ва'шего дру'га и'ли ва'шу подру'гу: како'й он, кака'я она'?",es:"Describí a un amigo o una amiga: ¿cómo es?",focus:"Adjetivos y acusativo de personas"},
 {id:"r19",b:"pp",l:11,p:213,ru:"Каки'е блю'да гото'вит ва'ша ма'ма? Каки'е они'?",es:"¿Qué platos cocina tu mamá? ¿Cómo son?",focus:"Adjetivos en plural"},
 {id:"r20",b:"a2",l:22,p:45,ru:"Вы ча'сто слу'шаете гро'мкую му'зыку? Что слы'шат ва'ши сосе'ди?",es:"¿Escuchás música fuerte seguido? ¿Qué escuchan tus vecinos?",focus:"слу'шать ≠ слы'шать; acusativo"}
];
const ERR_TAGS=["Genitivo","Dativo","Acusativo","Instrumental","Preposicional","Conjugación","Pasado","Género y concordancia","Acentos","Vocabulario","Orden de palabras"];


const LESSONS=deep([
 {n:1,part:1,p:26,text:"Фотогра'фии",g:["Структура предложения. Кто/что э'то?","Личные местоимения (я … они')","Кто он? (профессия)","Конструкция «не…, а…»"],talk:["Э'то Ива'н.","Он ме'неджер. Э'то кни'га.","Я не зна'ю, кто э'то."],es:"Oraciones sin el verbo «ser» en presente, pronombres personales y profesiones."},
 {n:2,part:1,p:38,text:"Студе'нты",g:["Род существительных","Множественное число (м. и ж. род)","Где? (здесь ≠ там, вот ≠ вон)","Объект: acc. личных местоимений","Цифры, счёт. Ско'лько?","Как? (хорошо', пло'хо, отли'чно)"],talk:["Где метро'?","Как дела'? — Хорошо', а у вас?","Чай и'ли ко'фе?"],es:"Género y plural de los sustantivos, ¿где?, pronombres como objeto y números."},
 {n:3,part:1,p:49,text:"Бори'с — бизнесме'н",g:["У кого' что есть. Есть ≠ нет","Глаголы I спряжения на -ать (настоящее время)","И'ли / и… и…","То'же"],talk:["Ско'лько сто'ит?","Я ду'маю, что…","Э'то интере'сно, ва'жно, легко'."],es:"«У меня есть» para decir tener y los verbos de la I conjugación en presente."},
 {n:4,part:1,p:63,text:"Моя' семья'",g:["Притяжательные местоимения. Чей?","Где? — сле'ва, спра'ва, наверху', внизу', сза'ди","а, и или но","Вопрос без вопросительного слова (интонация)","Де'лать + объект (acc.)","Глагол рабо'тать"],talk:["Где мои' ве'щи?","Чьи э'то ве'щи?","У тебя' есть мой телефо'н?"],es:"Posesivos, ubicaciones, conectores а/и/но y la entonación de la pregunta."},
 {n:5,part:1,p:74,text:"Я студе'нт",g:["Снача'ла ≠ пото'м","Прошедшее время (ра'ньше, час наза'д)","Дни неде'ли","Ещё ≠ уже'","И'мя, о'тчество, фами'лия","Что зна'чит?","Параллельные действия"],talk:["Ты уже' зна'ешь?","Нет, я ещё не зна'ю.","В магази'не. Анке'та."],es:"Pasado, días de la semana, ещё / уже y el nombre completo ruso."},
 {n:6,part:2,p:90,text:"О'фис · Рестора'н",g:["Глаголы I спр. на -ать/-ять: рабо'тать, игра'ть, гуля'ть…","Как? (интере'сно, бы'стро, ме'дленно…)","Словообразование: сфера/профессия","Ме'сто: где? в/на -е"],talk:["Как вы рабо'таете?","Не так бы'стро, пожа'луйста!","Где кафе'?"],es:"Más verbos de la I conjugación, adverbios de modo y ¿где? con в/на + -е."},
 {n:7,part:2,p:100,text:"Суббо'та · Теа'тр",g:["Вре'мя: когда'? у'тром, днём, ве'чером, но'чью","Глаголы начина'ть, конча'ть","Словообразование: отдыха'ть → о'тдых","Объект после транзитивных глаголов","Что, кто, где, когда' в сложных предложениях"],talk:["Я никогда' здесь не отдыха'ю.","Я зна'ю, где он рабо'тает."],es:"Momentos del día, начинать / кончать y oraciones compuestas con что, где, когда."},
 {n:8,part:2,p:116,text:"Моя' фи'рма",g:["Прошедшее время: у меня' был","За + acc.: спаси'бо за…, извини'те за…","Притяжательные местоимения (повторение)"],talk:["Что вы вчера' де'лали?","Спаси'бо за ко'фе, извини'те за опозда'ние."],es:"«У меня был», спасибо за / извините за y repaso de posesivos."},
 {n:9,part:2,p:125,text:"Я не трудого'лик",g:["Гл. II спряжения: учи'ть, говори'ть, смотре'ть, стоя'ть…","Весь, вся, всё, все","Давно' ≠ неда'вно","Потому' что, так как, поэ'тому","Где? (в/на -е/-ии) без исключений","Гл. жить","Ду'мать + о чём?","Будущее время глагола быть"],talk:["Где вы живёте?","Вчера' бы'ло тепло'.","За'втра, послеза'втра, че'рез час."],es:"II conjugación, causa y consecuencia, ¿где? con -е / -ии y el futuro de быть."},
 {n:10,part:2,p:143,text:"Кто что хорошо' де'лает?",g:["Множественное число (м., ср., ж.) с исключениями","Стра'ны и национа'льности","Не то'лько, но и","Как ча'сто? (ча'сто ≠ ре'дко)","Здесь не ку'рят","Быть или быва'ть"],talk:["Как ва'ши дела'?","Вы ча'сто э'то де'лаете?"],es:"Plural con excepciones, países y nacionalidades, frecuencia."},
 {n:11,part:3,p:160,text:"Семе'йное сча'стье",g:["Прилагательные","Э'то или э'тот. Э'тот ≠ тот"],talk:["Како'й челове'к? Кака'я вещь?"],es:"Adjetivos y этот / тот."},
 {n:12,part:3,p:171,text:"Колле'га",g:["Сравнительная степень","Превосходная степень","Сложное предложение (+ кото'рый)","Хоте'ть, мочь, быть до'лжным"],talk:["Кто рабо'тает лу'чше?"],es:"Comparativo, superlativo, который y хотеть / мочь."},
 {n:13,part:3,p:186,text:"Бра'т и сестра'",g:["Гл. II спр. с чередованием","Acc. существительных и притяж. местоимений","Императив"],talk:["Рабо'тай! Не рабо'тай!"],es:"Verbos con alternancia, acusativo e imperativo."},
 {n:14,part:3,p:197,text:"Муж и жена'",g:["Структура предложения, вопросы","Прямая и косвенная речь","Отрицательные местоимения","Предложный падеж ед. ч.: где?","Гл. жить"],talk:["Никто' нигде' ничего' не де'лает."],es:"Estilo indirecto, pronombres negativos y caso preposicional."},
 {n:15,part:3,p:206,text:"Зоопа'рк",g:["В или на?","Исключения (где?): -и (ж.), -у (м.)","Предложный падеж: о ком, о чём?","Гл. мечта'ть, спо'рить, писа'ть","Цветовые прилагательные"],talk:["О чём вы мечта'ете?"],es:"Excepciones en -у / -и, preposicional con о y colores."},
 {n:16,part:4,p:224,text:"Лу'чше по'здно, чем никогда'",g:["Гл. II спр. с чередованием д/ж","Где или куда'?","Гл. ждать","Гл. движения: идти' — ходи'ть"],talk:["Иди'те пря'мо!"],es:"Где / куда y verbos de movimiento."},
 {n:17,part:4,p:239,text:"Подру'ги",g:["Идти' — ходи'ть (2)","Конструкции цели (что'бы)"],talk:["Куда' ты сего'дня идёшь?"],es:"Verbos de movimiento (2) y чтобы."},
 {n:18,part:4,p:246,text:"Я учу'сь учи'ться",g:["Учи'ться, учи'ть, изуча'ть","Знать или уме'ть?","Ско'лько или како'й? (числительные)"],talk:["Вы уме'ете гото'вить?"],es:"Estudiar, знать / уметь y números ordinales."},
 {n:19,part:4,p:259,text:"Выходно'й день студе'нта",g:["Глаголы на -ва-","Как до'лго или когда'?","В ме'сяце, году' (prep.) ↔ в понеде'льник (acc.)","Игра'ть во что или на чём?"],talk:["Во ско'лько?"],es:"Verbos en -ва-, expresiones de tiempo, играть в / на."},
 {n:20,part:4,p:273,text:"Вегетариа'нка",g:["Гл. петь, пить, мыть. Гл. есть"],talk:["Я пью за ва'ше здоро'вье!"],es:"Петь, пить, мыть y есть."}
]);
const PARTS={1:"Часть I · Уроки 1–5",2:"Часть II · Уроки 6–10",3:"Часть III · Уроки 11–15",4:"Часть IV · Уроки 16–20"};
