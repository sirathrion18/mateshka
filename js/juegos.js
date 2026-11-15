/* Матешка · bancos de los juegos diarios.
   Casos: palabras con sus seis formas (nom, gen, dat, acc, ins, prep), en singular y plural.
   Etiquetas: per = persona, ani = animal, tiene = cosa que se puede tener, beb = bebida, com = comida,
   lugar = ciudad o país, sitio = lugar al que se va, act = actividad, prof = profesión, lee = algo que se lee,
   evento = algo que termina (para «после»). */
const NOUNS=[
 {w:"брат",g:"m",an:1,t:"per",s:"брат,брата,брату,брата,братом,брате",p:"братья,братьев,братьям,братьев,братьями,братьях",es:"hermano"},
 {w:"друг",g:"m",an:1,t:"per",s:"друг,друга,другу,друга,другом,друге",p:"друзья,друзей,друзьям,друзей,друзьями,друзьях",es:"amigo"},
 {w:"сестра",g:"f",an:1,t:"per",s:"сестра,сестры,сестре,сестру,сестрой,сестре",p:"сёстры,сестёр,сёстрам,сестёр,сёстрами,сёстрах",es:"hermana"},
 {w:"мама",g:"f",an:1,t:"per",s:"мама,мамы,маме,маму,мамой,маме",es:"mamá"},
 {w:"папа",g:"m",an:1,t:"per",s:"папа,папы,папе,папу,папой,папе",es:"papá",nota:"masculino en -а: se declina como femenino"},
 {w:"подруга",g:"f",an:1,t:"per",s:"подруга,подруги,подруге,подругу,подругой,подруге",p:"подруги,подруг,подругам,подруг,подругами,подругах",es:"amiga"},
 {w:"учитель",g:"m",an:1,t:"per prof",s:"учитель,учителя,учителю,учителя,учителем,учителе",p:"учителя,учителей,учителям,учителей,учителями,учителях",es:"maestro"},
 {w:"студент",g:"m",an:1,t:"per",s:"студент,студента,студенту,студента,студентом,студенте",p:"студенты,студентов,студентам,студентов,студентами,студентах",es:"estudiante"},
 {w:"студентка",g:"f",an:1,t:"per",s:"студентка,студентки,студентке,студентку,студенткой,студентке",p:"студентки,студенток,студенткам,студенток,студентками,студентках",es:"estudiante (ella)"},
 {w:"бабушка",g:"f",an:1,t:"per",s:"бабушка,бабушки,бабушке,бабушку,бабушкой,бабушке",p:"бабушки,бабушек,бабушкам,бабушек,бабушками,бабушках",es:"abuela"},
 {w:"сосед",g:"m",an:1,t:"per",s:"сосед,соседа,соседу,соседа,соседом,соседе",p:"соседи,соседей,соседям,соседей,соседями,соседях",es:"vecino"},
 {w:"соседка",g:"f",an:1,t:"per",s:"соседка,соседки,соседке,соседку,соседкой,соседке",p:"соседки,соседок,соседкам,соседок,соседками,соседках",es:"vecina"},
 {w:"врач",g:"m",an:1,t:"per prof",s:"врач,врача,врачу,врача,врачом,враче",p:"врачи,врачей,врачам,врачей,врачами,врачах",es:"médico"},
 {w:"инженер",g:"m",an:1,t:"prof",s:"инженер,инженера,инженеру,инженера,инженером,инженере",es:"ingeniero"},
 {w:"журналист",g:"m",an:1,t:"prof",s:"журналист,журналиста,журналисту,журналиста,журналистом,журналисте",es:"periodista"},
 {w:"дочь",g:"f",an:1,t:"per",s:"дочь,дочери,дочери,дочь,дочерью,дочери",es:"hija",nota:"femenino en -ь"},
 {w:"коллега",g:"m",an:1,t:"per",s:"коллега,коллеги,коллеге,коллегу,коллегой,коллеге",p:"коллеги,коллег,коллегам,коллег,коллегами,коллегах",es:"colega"},
 {w:"собака",g:"f",an:1,t:"ani tiene",s:"собака,собаки,собаке,собаку,собакой,собаке",p:"собаки,собак,собакам,собак,собаками,собаках",es:"perro"},
 {w:"кошка",g:"f",an:1,t:"ani tiene",s:"кошка,кошки,кошке,кошку,кошкой,кошке",p:"кошки,кошек,кошкам,кошек,кошками,кошках",es:"gata"},
 {w:"кот",g:"m",an:1,t:"ani tiene",s:"кот,кота,коту,кота,котом,коте",p:"коты,котов,котам,котов,котами,котах",es:"gato"},
 {w:"стол",g:"m",an:0,t:"cosa",s:"стол,стола,столу,стол,столом,столе",p:"столы,столов,столам,столы,столами,столах",es:"mesa"},
 {w:"словарь",g:"m",an:0,t:"tiene",s:"словарь,словаря,словарю,словарь,словарём,словаре",p:"словари,словарей,словарям,словари,словарями,словарях",es:"diccionario"},
 {w:"книга",g:"f",an:0,t:"tiene lee",s:"книга,книги,книге,книгу,книгой,книге",p:"книги,книг,книгам,книги,книгами,книгах",es:"libro"},
 {w:"машина",g:"f",an:0,t:"tiene",s:"машина,машины,машине,машину,машиной,машине",p:"машины,машин,машинам,машины,машинами,машинах",es:"auto"},
 {w:"тетрадь",g:"f",an:0,t:"tiene",s:"тетрадь,тетради,тетради,тетрадь,тетрадью,тетради",p:"тетради,тетрадей,тетрадям,тетради,тетрадями,тетрадях",es:"cuaderno"},
 {w:"письмо",g:"n",an:0,t:"lee",s:"письмо,письма,письму,письмо,письмом,письме",p:"письма,писем,письмам,письма,письмами,письмах",es:"carta"},
 {w:"журнал",g:"m",an:0,t:"lee tiene",s:"журнал,журнала,журналу,журнал,журналом,журнале",p:"журналы,журналов,журналам,журналы,журналами,журналах",es:"revista"},
 {w:"дом",g:"m",an:0,t:"edif",s:"дом,дома,дому,дом,домом,доме",p:"дома,домов,домам,дома,домами,домах",es:"casa, edificio"},
 {w:"магазин",g:"m",an:0,t:"sitio",s:"магазин,магазина,магазину,магазин,магазином,магазине",p:"магазины,магазинов,магазинам,магазины,магазинами,магазинах",es:"negocio"},
 {w:"музей",g:"m",an:0,t:"sitio",s:"музей,музея,музею,музей,музеем,музее",p:"музеи,музеев,музеям,музеи,музеями,музеях",es:"museo"},
 {w:"театр",g:"m",an:0,t:"sitio evento",s:"театр,театра,театру,театр,театром,театре",p:"театры,театров,театрам,театры,театрами,театрах",es:"teatro"},
 {w:"школа",g:"f",an:0,t:"sitio",s:"школа,школы,школе,школу,школой,школе",p:"школы,школ,школам,школы,школами,школах",es:"escuela"},
 {w:"университет",g:"m",an:0,t:"sitio",s:"университет,университета,университету,университет,университетом,университете",es:"universidad"},
 {w:"окно",g:"n",an:0,t:"cosa",s:"окно,окна,окну,окно,окном,окне",p:"окна,окон,окнам,окна,окнами,окнах",es:"ventana"},
 {w:"город",g:"m",an:0,t:"lugar",s:"город,города,городу,город,городом,городе",p:"города,городов,городам,города,городами,городах",es:"ciudad"},
 {w:"Москва",g:"f",an:0,t:"lugar",s:"Москва,Москвы,Москве,Москву,Москвой,Москве",es:"Moscú"},
 {w:"Россия",g:"f",an:0,t:"lugar",s:"Россия,России,России,Россию,Россией,России",es:"Rusia",nota:"femenino en -ия"},
 {w:"Аргентина",g:"f",an:0,t:"lugar",s:"Аргентина,Аргентины,Аргентине,Аргентину,Аргентиной,Аргентине",es:"Argentina"},
 {w:"сок",g:"m",an:0,t:"beb",s:"сок,сока,соку,сок,соком,соке",es:"jugo"},
 {w:"вода",g:"f",an:0,t:"beb",s:"вода,воды,воде,воду,водой,воде",es:"agua"},
 {w:"молоко",g:"n",an:0,t:"beb leche",s:"молоко,молока,молоку,молоко,молоком,молоке",es:"leche"},
 {w:"сыр",g:"m",an:0,t:"com acomp",s:"сыр,сыра,сыру,сыр,сыром,сыре",es:"queso"},
 {w:"хлеб",g:"m",an:0,t:"com",s:"хлеб,хлеба,хлебу,хлеб,хлебом,хлебе",es:"pan"},
 {w:"работа",g:"f",an:0,t:"evento",s:"работа,работы,работе,работу,работой,работе",es:"trabajo"},
 {w:"фильм",g:"m",an:0,t:"evento",s:"фильм,фильма,фильму,фильм,фильмом,фильме",p:"фильмы,фильмов,фильмам,фильмы,фильмами,фильмах",es:"película"},
 {w:"урок",g:"m",an:0,t:"clase",s:"урок,урока,уроку,урок,уроком,уроке",p:"уроки,уроков,урокам,уроки,уроками,уроках",es:"clase"},
 {w:"музыка",g:"f",an:0,t:"act",s:"музыка,музыки,музыке,музыку,музыкой,музыке",es:"música"},
 {w:"спорт",g:"m",an:0,t:"act",s:"спорт,спорта,спорту,спорт,спортом,спорте",es:"deporte"},
 {w:"футбол",g:"m",an:0,t:"act",s:"футбол,футбола,футболу,футбол,футболом,футболе",es:"fútbol"},
 {w:"русский язык",g:"m",an:0,t:"act",s:"русский язык,русского языка,русскому языку,русский язык,русским языком,русском языке",es:"idioma ruso"}
];
/* Plantillas por caso (1 gen, 2 dat, 3 acc, 4 ins, 5 prep): [frase con ___, etiqueta, número (s/p/sp), pista en castellano] */
const CASE_TPL={
 1:[["У меня нет ___.","tiene","s","No tengo…"],["Это книга ___.","per","s","Es el libro de…"],["Купи, пожалуйста, литр ___.","beb","s","Comprá un litro de…"],["Дай мне кусок ___.","com","s","Dame un pedazo de…"],["Здесь много ___.","sitio cosa per edif","p","Acá hay muchos…"],["У нас пять ___.","per tiene","p","Tenemos cinco…"],["Я приехала из ___.","lugar","s","Vine de…"],["Мы гуляли после ___.","evento clase","s","Paseamos después de…"],["В комнате нет ___.","cosa tiene","s","En el cuarto no hay…"]],
 2:[["Я звоню ___.","per","sp","Llamo a…"],["Я подарила цветы ___.","per","s","Le regalé flores a…"],["Мы помогаем ___.","per","sp","Ayudamos a…"],["Завтра я иду к ___.","per","s","Mañana voy a lo de…"],["Я написала письмо ___.","per","sp","Le escribí una carta a…"],["Сколько лет ___?","per","s","¿Cuántos años tiene…?"]],
 3:[["Я вижу ___.","per ani cosa edif","sp","Veo a / veo…"],["Я очень люблю ___.","per ani act lugar","s","Quiero mucho a / me encanta…"],["Мы идём в ___.","sitio","s","Vamos a…"],["Я читаю ___.","lee","sp","Leo…"],["Я жду ___.","per","s","Espero a…"],["Вчера я встретила ___.","per","sp","Ayer me encontré con…"]],
 4:[["Я гуляю с ___.","per ani","sp","Paseo con…"],["Он хочет стать ___.","prof","s","Quiere ser…"],["Я занимаюсь ___.","act","s","Me dedico a / practico…"],["Я пью чай с ___.","leche","s","Tomo té con…"],["Я ем хлеб с ___.","acomp","s","Como pan con…"],["Машина стоит рядом с ___.","sitio edif","s","El auto está al lado de…"],["Мы познакомились с ___.","per","s","Nos conocimos con…"]],
 5:[["Я думаю о ___.","per ani lee","sp","Pienso en…"],["Мы живём в ___.","lugar","s","Vivimos en…"],["Книга лежит на ___.","cosa","s","El libro está sobre…"],["Вчера мы были в ___.","sitio","s","Ayer estuvimos en…"],["Мы говорим о ___.","evento lee act","s","Hablamos de…"]]
};
const CASE_NAME=["Nominativo","Genitivo","Dativo","Acusativo","Instrumental","Preposicional"];
const CASE_RU=["имени'тельный","роди'тельный","да'тельный","вини'тельный","твори'тельный","предло'жный"];
/* Reglas cortas para explicar cada respuesta: [caso][género][animado] */
const CASE_RULE={
 1:{m:"Masculino: consonante + -а; -й / -ь → -я.",n:"Neutro: -о → -а; -е → -я.",f:"Femenino: -а → -ы (-и después de к, г, х, ж, ш, ч, щ); -я, -ь, -ия → -и.",p:"Plural: -ов / -ев / -ей en masculino; femenino y neutro pierden la terminación (книг, окон)."},
 2:{m:"Masculino: + -у; -й / -ь → -ю.",n:"Neutro: -о → -у; -е → -ю.",f:"Femenino: -а / -я → -е; -ия → -ии; -ь → -и.",p:"Plural: -ам / -ям."},
 3:{ma:"Masculino animado: igual al genitivo (-а / -я).",mi:"Masculino de cosa: no cambia.",n:"Neutro: no cambia.",f:"Femenino: -а → -у; -я → -ю; -ь no cambia.",pa:"Plural animado: igual al genitivo plural.",pi:"Plural de cosas: igual al nominativo plural."},
 4:{m:"Masculino: + -ом; -й / -ь → -ем (-ём con acento).",n:"Neutro: -о → -ом; -е → -ем.",f:"Femenino: -а → -ой; -я → -ей; -ь → -ью.",p:"Plural: -ами / -ями."},
 5:{m:"Masculino: + -е.",n:"Neutro: -о → -е; -ие → -ии.",f:"Femenino: -а / -я → -е; -ия → -ии; -ь → -и.",p:"Plural: -ах / -ях."}
};
/* Oración propia por caso */
const CASE_FREE={
 1:["Contá qué NO tenés en tu casa (нет + genitivo).","Contá de dónde son tus amigos (из + genitivo).","Contá qué hiciste después del trabajo (после + genitivo)."],
 2:["Contá a quién llamaste esta semana (звонить + dativo).","Contá a quién le regalaste algo hace poco.","Contá a quién ayudás seguido."],
 3:["Contá a quién viste ayer (acusativo animado).","Contá qué te encanta hacer o comer (люблю + acusativo).","Contá a dónde vas el fin de semana (в / на + acusativo)."],
 4:["Contá con quién paseás o tomás mate (с + instrumental).","Contá qué querías ser de chica (стать + instrumental).","Contá a qué te dedicás en tu tiempo libre (заниматься + instrumental)."],
 5:["Contá en qué ciudad vivís y dónde trabajás (в / на + preposicional).","Contá en qué pensás antes de dormir (думать о + preposicional).","Contá de qué hablaste con un amigo hace poco."]
};

/* Verbos: elegir el aspecto. ans = índice correcto; pista = palabra que lo decide. Lección mínima para que aparezca. */
const ASPECT_CHOOSE=[
 {l:24,ru:"Я до'лго ___ кни'гу, потому' что э'то тру'дно.",o:["писа'ла","написа'ла"],a:0,why:"«до'лго» habla de duración: proceso → imperfectivo.",src:"p. 62"},
 {l:24,ru:"Ме'сяц наза'д я ___ кни'гу, сейча'с её чита'ют мои' друзья'.",o:["писа'ла","написа'ла"],a:1,why:"La terminó y hay resultado (la leen) → perfectivo.",src:"p. 62"},
 {l:24,ru:"Ба'бушка вчера' ___ о'чень вку'сный борщ.",o:["гото'вила","пригото'вила"],a:1,why:"Resultado: el borsch quedó hecho y rico → perfectivo.",src:"p. 62"},
 {l:24,ru:"Она' два часа' ___ борщ.",o:["гото'вила","пригото'вила"],a:0,why:"«два часа'» es duración → imperfectivo.",src:"p. 62"},
 {l:24,ru:"Они' ___ пи'во весь ве'чер.",o:["пи'ли","вы'пили"],a:0,why:"«весь ве'чер» es duración → imperfectivo.",src:"p. 62"},
 {l:24,ru:"Они' ___ пять ли'тров пи'ва.",o:["пи'ли","вы'пили"],a:1,why:"Una cantidad exacta y terminada → perfectivo.",src:"p. 62"},
 {l:24,ru:"Она' весь ве'чер ___ телеви'зор.",o:["смотре'ла","посмотре'ла"],a:0,why:"«весь ве'чер» → proceso, imperfectivo.",src:"p. 62"},
 {l:24,ru:"Вчера' я наконе'ц ___ э'тот фильм. Отли'чный фильм!",o:["смотре'ла","посмотре'ла"],a:1,why:"«наконе'ц» marca el final, el resultado → perfectivo.",src:"p. 62"},
 {l:24,ru:"Мой сын о'чень лю'бит ___.",o:["чита'ть","прочита'ть"],a:0,why:"Después de люби'ть va siempre el imperfectivo.",src:"p. 62"},
 {l:24,ru:"Он ___ все кни'ги, кото'рые есть у нас до'ма.",o:["чита'л","прочита'л"],a:1,why:"«все кни'ги»: cantidad completa → perfectivo.",src:"p. 62"},
 {l:24,ru:"Я то'лько вчера' ___, что ты здесь рабо'таешь.",o:["зна'ла","узна'ла"],a:1,why:"El comienzo del saber (enterarse) → perfectivo.",src:"p. 62"},
 {l:24,ru:"Ка'ждый день я ___ журна'лы.",o:["чита'ю","прочита'ю"],a:0,why:"«ка'ждый день»: repetición → imperfectivo.",src:"p. 59"},
 {l:24,ru:"Когда' я ___ обе'д, я пообе'дала.",o:["гото'вила","пригото'вила"],a:1,why:"Acciones en cadena: primero termina una → perfectivo.",src:"p. 59"},
 {l:24,ru:"Когда' я обе'дала, я ___ журна'л.",o:["чита'ла","прочита'ла"],a:0,why:"Dos acciones a la vez → imperfectivo.",src:"p. 59"},
 {l:24,ru:"Вчера' я мы'ла посу'ду, но не ___.",o:["мы'ла","вы'мыла"],a:1,why:"Lo hizo, pero no llegó al resultado (no la terminó) → perfectivo con «не».",src:"p. 61"},
 {l:24,ru:"Что ты ___ вчера' ве'чером?",o:["де'лала","сде'лала"],a:0,why:"Pregunta general por la actividad → imperfectivo.",src:"p. 59"},
 {l:24,ru:"Извини'те, что вы ___?",o:["говори'ли","сказа'ли"],a:1,why:"Una frase concreta ya dicha → perfectivo (сказа'ть).",src:"p. 56"},
 {l:24,ru:"Сего'дня мы до'лго ___ о рабо'те.",o:["говори'ли","сказа'ли"],a:0,why:"«до'лго» → proceso: говори'ть.",src:"p. 56"},
 {l:24,ru:"За'втра я ___ э'ту кни'гу до конца'.",o:["бу'ду чита'ть","прочита'ю"],a:1,why:"Futuro con resultado (hasta el final) → perfectivo: прочита'ю.",src:"p. 59"},
 {l:24,ru:"За'втра весь ве'чер я ___.",o:["бу'ду чита'ть","прочита'ю"],a:0,why:"Futuro como proceso (toda la noche) → бу'ду + imperfectivo.",src:"p. 59"},
 {l:25,ru:"Ка'ждый день ма'ма ___ хлеб и молоко'.",o:["покупа'ет","ку'пит"],a:0,why:"«ка'ждый день»: costumbre → imperfectivo.",src:"p. 73"},
 {l:25,ru:"Вчера' подру'га ___ краси'вое пла'тье.",o:["покупа'ла","купи'ла"],a:1,why:"Una compra concreta, terminada → perfectivo.",src:"p. 73"},
 {l:25,ru:"Е'сли ты бу'дешь хорошо' учи'ться, я ___ тебе' велосипе'д.",o:["бу'ду покупа'ть","куплю'"],a:1,why:"Un resultado en el futuro → perfectivo: куплю'.",src:"p. 73"},
 {l:25,ru:"Я ра'ньше никогда' не ___ там оде'жду.",o:["покупа'ла","купи'ла"],a:0,why:"«никогда' не» habla de costumbre → imperfectivo.",src:"p. 73"},
 {l:25,ru:"Попро'буйте торт! — Спаси'бо, я уже' ___.",o:["про'бовала","попро'бовала"],a:1,why:"Ya está hecho (resultado) → perfectivo.",src:"p. 73"},
 {l:28,ru:"Я до'лго ___ ключи' и наконе'ц нашла'.",o:["иска'ла","нашла'"],a:0,why:"«до'лго» → proceso: иска'ть.",src:"p. 124"},
 {l:30,ru:"Возьми' зонт! — Не на'до, я уже' ___.",o:["брала'","взяла'"],a:1,why:"Resultado: ya lo tiene → взять.",src:"p. 146"},
 {l:33,ru:"Он ___ мне свои' фотогра'фии весь ве'чер.",o:["пока'зывал","показа'л"],a:0,why:"«весь ве'чер» → proceso, imperfectivo.",src:"p. 190"},
 {l:33,ru:"Она' ___ мне, где живёт, и я сра'зу нашла' дом.",o:["объясня'ла","объясни'ла"],a:1,why:"«сра'зу» y un resultado → perfectivo.",src:"p. 190"}
];
/* Verbos: conjugar. v = infinitivo que se muestra, a = respuesta, por = sujeto */
const ASPECT_CONJ=[
 {l:24,ru:"За'втра я ___ э'ту кни'гу.",v:"прочита'ть",a:"прочита'ю",why:"Perfectivo: su forma conjugada ya es futuro."},
 {l:24,ru:"Сейча'с я ___ письмо'.",v:"писа'ть",a:"пишу'",why:"Ahora mismo, en proceso → imperfectivo en presente: пишу'."},
 {l:24,ru:"Я ___ тебе' за'втра.",v:"отве'тить",a:"отве'чу",why:"Futuro perfectivo; т → ч en «я»."},
 {l:24,ru:"Ты ___ пото'м?",v:"отдохну'ть",a:"отдохнёшь",why:"Futuro perfectivo de отдохну'ть."},
 {l:24,ru:"Ве'чером мы ___ ужин.",v:"пригото'вить",a:"пригото'вим",why:"Futuro perfectivo: мы пригото'вим."},
 {l:24,ru:"Она' ___ вопро'с.",v:"поня'ть",a:"поймёт",why:"Поня'ть cambia mucho: я пойму', она' поймёт."},
 {l:24,ru:"Что ты ___ на день рожде'ния?",v:"сказа'ть",a:"ска'жешь",why:"Futuro perfectivo: ты ска'жешь (з → ж)."},
 {l:24,ru:"Они' ___ дом за год.",v:"постро'ить",a:"постро'ят",why:"Futuro perfectivo, II conjugación: они' постро'ят."},
 {l:24,ru:"Я ___ тебе' кни'гу.",v:"дать",a:"дам",why:"Дать es irregular: дам, дашь, даст, дади'м, дади'те, даду'т."},
 {l:24,ru:"Ка'ждый ве'чер я ___ журна'л.",v:"чита'ть",a:"чита'ю",why:"Costumbre → imperfectivo en presente."},
 {l:25,ru:"За'втра я ___ хлеб.",v:"купи'ть",a:"куплю'",why:"Купи'ть: п → пл en «я»: куплю'."},
 {l:25,ru:"Ты ___ мне, что взять?",v:"посове'товать",a:"посове'туешь",why:"-ова- → -у- en el futuro: посове'тую, посове'туешь."},
 {l:25,ru:"Мы ча'сто ___ в Росси'ю.",v:"путеше'ствовать",a:"путеше'ствуем",why:"-ова- → -у-: мы путеше'ствуем."},
 {l:25,ru:"Как ты себя' ___?",v:"чу'вствовать",a:"чу'вствуешь",why:"Чу'вствовать: -ова- → -у-: ты чу'вствуешь."},
 {l:25,ru:"Ма'ма ка'ждый день ___ фру'кты.",v:"покупа'ть",a:"покупа'ет",why:"Costumbre → imperfectivo: покупа'ет."},
 {l:25,ru:"Я ___ э'тот торт!",v:"попро'бовать",a:"попро'бую",why:"Futuro perfectivo: попро'бую."},
 {l:28,ru:"Не волну'йся, я ___ твои' ключи'.",v:"найти'",a:"найду'",why:"Найти': я найду', ты найдёшь."},
 {l:30,ru:"Я ___ зонт.",v:"взять",a:"возьму'",why:"Взять: я возьму', ты возьмёшь."},
 {l:31,ru:"Я ___ ма'ме ве'чером.",v:"позвони'ть",a:"позвоню'",why:"Futuro perfectivo: позвоню'."},
 {l:35,ru:"Я тебе' ___!",v:"помо'чь",a:"помогу'",why:"Помо'чь: помогу', помо'жешь, помо'гут."}
];
/* Mini historias: cada [[n]] es un hueco con dos opciones */
const STORIES=[
 {l:24,t:"Суббо'та",src:"lección 24",
  text:"Вчера' ба'бушка [[0]] борщ два часа'. Пото'м она' [[1]] пиро'г, и мы [[2]] всё. Ве'чером мы до'лго [[3]] о семье'.",
  s:[["гото'вила","пригото'вила",0,"«два часа'» → proceso"],["пекла'","испекла'",1,"El pastel quedó hecho → resultado"],["е'ли","съе'ли",1,"«всё»: todo, completo → perfectivo"],["говори'ли","сказа'ли",0,"«до'лго» → proceso"]]},
 {l:24,t:"Но'вый журна'л",src:"p. 57",
  text:"— Что ты [[0]] вчера' ве'чером? — [[1]] но'вый журна'л. — Наве'рное, ты [[2]] весь журна'л? — Да, и пото'м [[3]].",
  s:[["де'лал","сде'лал",0,"Pregunta general por la actividad"],["Чита'л","Прочита'л",0,"Responde qué hacía: proceso"],["чита'л","прочита'л",1,"«весь журна'л»: completo → resultado"],["у'жинал","поу'жинал",1,"Acción que viene después de otra terminada"]]},
 {l:25,t:"В магази'не",src:"lección 25",
  text:"Ка'ждую суббо'ту я [[0]] проду'кты в магази'не у до'ма. Вчера' я [[1]] паке'т молока' и кусо'к сы'ра. За'втра я [[2]] торт, потому' что у ма'мы день рожде'ния. Она' всегда' [[3]] шокола'дные то'рты.",
  s:[["покупа'ю","куплю'",0,"«ка'ждую суббо'ту»: costumbre"],["покупа'ла","купи'ла",1,"Compra concreta, terminada"],["бу'ду покупа'ть","куплю'",1,"Un resultado en el futuro"],["лю'бит","полю'бит",0,"«всегда'»: costumbre, imperfectivo"]]},
 {l:24,t:"Письмо'",src:"p. 61",
  text:"Журнали'ст [[0]] статью' весь день, но не [[1]] её. Поэ'тому чита'тели её не [[2]]. За'втра он её обяза'тельно [[3]].",
  s:[["писа'л","написа'л",0,"«весь день» → proceso"],["писа'л","написа'л",1,"«не + perfectivo»: no llegó al resultado"],["чита'ли","прочита'ли",1,"Resultado que no ocurrió"],["бу'дет писа'ть","напи'шет",1,"«обяза'тельно» + resultado en el futuro"]]}
];
