/* =============================================================================
   cv-core.js — SOURCE OF TRUTH
   Extracted verbatim from CityView_2_0_KPI_Command_Center_Executive.html.
   Every figure, place name, KPI, dimension, event, insight and action the Lens
   renders resolves to a symbol defined in this file. Nothing here is authored by
   this prototype — do not edit by hand.
   Regenerate with: node tools/extract-core.js
   ============================================================================= */
/* --- source lines 2295-2297 --- */
const SEED={"national":{"comp":70,"axes":{"health":77,"commercial":76,"construction":68,"excavation":61,"distortion":68},"ind":{"compliance":76,"enforcement":66,"coverage":67},"vd_total":8318,"pop":34080000,"n_regions":13,"n_estab":418000,"best":[{"ar":"القصيم","comp":74},{"ar":"المنطقة الشرقية","comp":74},{"ar":"الرياض","comp":73}],"worst":[{"ar":"تبوك","comp":60},{"ar":"الحدود الشمالية","comp":60},{"ar":"الجوف","comp":60}]},"regions":[{"id":"R:Qassim","ar":"القصيم","en":"Qassim","c":[26.2915,43.324],"pop":1500000,"comp":74,"geo":"Qassim","cap":"بريدة","vd":132497,"ax":{"health":{"compliance":81,"enforcement":78,"coverage":66},"commercial":{"compliance":81,"enforcement":77,"coverage":80},"construction":{"compliance":84,"enforcement":67,"coverage":65},"excavation":{"compliance":81,"enforcement":71,"coverage":71},"distortion":{"compliance":50,"enforcement":84,"coverage":80}}},{"id":"R:Riyadh","ar":"الرياض","en":"Riyadh","c":[23.3944,45.2305],"pop":8600000,"comp":73,"geo":"Riyadh","cap":"الرياض","vd":2321,"ax":{"health":{"compliance":85,"enforcement":80,"coverage":72},"commercial":{"compliance":77,"enforcement":68,"coverage":85},"construction":{"compliance":73,"enforcement":62,"coverage":66},"excavation":{"compliance":69,"enforcement":67,"coverage":63},"distortion":{"compliance":80,"enforcement":70,"coverage":69}}},{"id":"R:Tabuk","ar":"تبوك","en":"Tabuk","c":[27.2544,38.9521],"pop":950000,"comp":60,"geo":"Tabuk","cap":"تبوك","vd":75904,"ax":{"health":{"compliance":80,"enforcement":57,"coverage":55},"commercial":{"compliance":85,"enforcement":62,"coverage":71},"construction":{"compliance":61,"enforcement":65,"coverage":60},"excavation":{"compliance":64,"enforcement":41,"coverage":44},"distortion":{"compliance":54,"enforcement":25,"coverage":80}}},{"id":"R:Madinah","ar":"المدينة المنورة","en":"Madinah","c":[25.0172,39.9098],"pop":2300000,"comp":72,"geo":"Madinah","cap":"المدينة","vd":59407,"ax":{"health":{"compliance":75,"enforcement":79,"coverage":80},"commercial":{"compliance":87,"enforcement":76,"coverage":70},"construction":{"compliance":81,"enforcement":68,"coverage":64},"excavation":{"compliance":65,"enforcement":53,"coverage":55},"distortion":{"compliance":79,"enforcement":72,"coverage":80}}},{"id":"R:Makkah","ar":"مكة المكرمة","en":"Makkah","c":[21.0054,41.4625],"pop":8900000,"comp":70,"geo":"Makkah","cap":"مكة","vd":201084,"ax":{"health":{"compliance":87,"enforcement":77,"coverage":80},"commercial":{"compliance":77,"enforcement":80,"coverage":83},"construction":{"compliance":76,"enforcement":63,"coverage":64},"excavation":{"compliance":60,"enforcement":44,"coverage":47},"distortion":{"compliance":80,"enforcement":56,"coverage":80}}},{"id":"R:Northern Region","ar":"الحدود الشمالية","en":"Northern Region","c":[29.8638,42.6711],"pop":380000,"comp":60,"geo":"Northern Region","cap":"عرعر","vd":24113,"ax":{"health":{"compliance":77,"enforcement":59,"coverage":57},"commercial":{"compliance":62,"enforcement":65,"coverage":52},"construction":{"compliance":59,"enforcement":61,"coverage":64},"excavation":{"compliance":51,"enforcement":56,"coverage":59},"distortion":{"compliance":62,"enforcement":40,"coverage":80}}},{"id":"R:Jawf","ar":"الجوف","en":"Jawf","c":[30.2053,39.7317],"pop":520000,"comp":60,"geo":"Jawf","cap":"سكاكا","vd":57853,"ax":{"health":{"compliance":65,"enforcement":55,"coverage":58},"commercial":{"compliance":59,"enforcement":63,"coverage":58},"construction":{"compliance":71,"enforcement":58,"coverage":45},"excavation":{"compliance":67,"enforcement":48,"coverage":55},"distortion":{"compliance":40,"enforcement":80,"coverage":80}}},{"id":"R:Hail","ar":"حائل","en":"Hail","c":[27.0396,41.4143],"pop":720000,"comp":68,"geo":"Hail","cap":"حائل","vd":26185,"ax":{"health":{"compliance":75,"enforcement":67,"coverage":75},"commercial":{"compliance":82,"enforcement":61,"coverage":66},"construction":{"compliance":67,"enforcement":68,"coverage":51},"excavation":{"compliance":62,"enforcement":53,"coverage":59},"distortion":{"compliance":74,"enforcement":75,"coverage":80}}},{"id":"R:Bahah","ar":"الباحة","en":"Bahah","c":[20.1235,41.3392],"pop":490000,"comp":62,"geo":"Bahah","cap":"الباحة","vd":25954,"ax":{"health":{"compliance":83,"enforcement":60,"coverage":64},"commercial":{"compliance":63,"enforcement":73,"coverage":73},"construction":{"compliance":58,"enforcement":58,"coverage":46},"excavation":{"compliance":52,"enforcement":39,"coverage":44},"distortion":{"compliance":66,"enforcement":81,"coverage":80}}},{"id":"R:Jizan","ar":"جازان","en":"Jizan","c":[17.3448,42.8054],"pop":1700000,"comp":61,"geo":"Jizan","cap":"جازان","vd":49200,"ax":{"health":{"compliance":58,"enforcement":51,"coverage":46},"commercial":{"compliance":72,"enforcement":66,"coverage":58},"construction":{"compliance":66,"enforcement":45,"coverage":51},"excavation":{"compliance":56,"enforcement":48,"coverage":56},"distortion":{"compliance":77,"enforcement":81,"coverage":80}}},{"id":"R:Asir","ar":"عسير","en":"Asir","c":[19.2024,42.9557],"pop":2300000,"comp":61,"geo":"Asir","cap":"أبها","vd":84103,"ax":{"health":{"compliance":73,"enforcement":65,"coverage":73},"commercial":{"compliance":74,"enforcement":50,"coverage":53},"construction":{"compliance":67,"enforcement":56,"coverage":60},"excavation":{"compliance":72,"enforcement":51,"coverage":50},"distortion":{"compliance":74,"enforcement":23,"coverage":80}}},{"id":"R:Najran","ar":"نجران","en":"Najran","c":[18.3899,45.7043],"pop":620000,"comp":67,"geo":"Najran","cap":"نجران","vd":28222,"ax":{"health":{"compliance":72,"enforcement":56,"coverage":76},"commercial":{"compliance":80,"enforcement":70,"coverage":67},"construction":{"compliance":73,"enforcement":55,"coverage":62},"excavation":{"compliance":70,"enforcement":52,"coverage":48},"distortion":{"compliance":70,"enforcement":70,"coverage":80}}},{"id":"R:Eastern Region","ar":"المنطقة الشرقية","en":"Eastern Region","c":[23.3082,50.2664],"pop":5100000,"comp":74,"geo":"Eastern Region","cap":"الدمام","vd":147464,"ax":{"health":{"compliance":82,"enforcement":84,"coverage":76},"commercial":{"compliance":88,"enforcement":73,"coverage":83},"construction":{"compliance":87,"enforcement":74,"coverage":74},"excavation":{"compliance":72,"enforcement":69,"coverage":72},"distortion":{"compliance":77,"enforcement":28,"coverage":80}}}],"cities":[{"id":"C:Qassim/بريدة","ar":"بريدة","en":"Buraidah","p":"R:Qassim","comp":69,"vd":557883},{"id":"C:Qassim/عنيزة","ar":"عنيزة","en":"Unaizah","p":"R:Qassim","comp":62,"vd":273045},{"id":"C:Qassim/الرس","ar":"الرس","en":"Ar Rass","p":"R:Qassim","comp":72,"vd":220489},{"id":"C:Qassim/المذنب","ar":"المذنب","en":"Al Mithnab","p":"R:Qassim","comp":57,"vd":215525},{"id":"C:Riyadh/الرياض","ar":"الرياض","en":"Riyadh","p":"R:Riyadh","comp":77,"vd":2226374},{"id":"C:Riyadh/الخرج","ar":"الخرج","en":"Al Kharj","p":"R:Riyadh","comp":58,"vd":1875052},{"id":"C:Riyadh/الدوادمي","ar":"الدوادمي","en":"Dawadmi","p":"R:Riyadh","comp":65,"vd":1298416},{"id":"C:Riyadh/المجمعة","ar":"المجمعة","en":"Al Majma'ah","p":"R:Riyadh","comp":67,"vd":1047221},{"id":"C:Riyadh/الزلفي","ar":"الزلفي","en":"Az Zulfi","p":"R:Riyadh","comp":53,"vd":1137320},{"id":"C:Riyadh/وادي الدواسر","ar":"وادي الدواسر","en":"Wadi ad-Dawasir","p":"R:Riyadh","comp":51,"vd":734803},{"id":"C:Tabuk/تبوك","ar":"تبوك","en":"Tabuk","p":"R:Tabuk","comp":59,"vd":321548},{"id":"C:Tabuk/ضباء","ar":"ضباء","en":"Duba","p":"R:Tabuk","comp":60,"vd":259222},{"id":"C:Tabuk/الوجه","ar":"الوجه","en":"Al Wajh","p":"R:Tabuk","comp":52,"vd":205951},{"id":"C:Tabuk/أملج","ar":"أملج","en":"Umluj","p":"R:Tabuk","comp":45,"vd":144493},{"id":"C:Madinah/المدينة المنورة","ar":"المدينة المنورة","en":"Madinah","p":"R:Madinah","comp":78,"vd":625233},{"id":"C:Madinah/ينبع","ar":"ينبع","en":"Yanbu","p":"R:Madinah","comp":63,"vd":621086},{"id":"C:Madinah/العلا","ar":"العلا","en":"AlUla","p":"R:Madinah","comp":71,"vd":322652},{"id":"C:Madinah/بدر","ar":"بدر","en":"Badr","p":"R:Madinah","comp":52,"vd":286999},{"id":"C:Makkah/مكة المكرمة","ar":"مكة المكرمة","en":"Makkah","p":"R:Makkah","comp":69,"vd":2506609},{"id":"C:Makkah/جدة","ar":"جدة","en":"Jeddah","p":"R:Makkah","comp":58,"vd":2257160},{"id":"C:Makkah/الطائف","ar":"الطائف","en":"Taif","p":"R:Makkah","comp":63,"vd":1178349},{"id":"C:Makkah/رابغ","ar":"رابغ","en":"Rabigh","p":"R:Makkah","comp":66,"vd":1033228},{"id":"C:Makkah/القنفذة","ar":"القنفذة","en":"Al Qunfudhah","p":"R:Makkah","comp":54,"vd":951761},{"id":"C:Northern Region/عرعر","ar":"عرعر","en":"Arar","p":"R:Northern Region","comp":59,"vd":135892},{"id":"C:Northern Region/رفحاء","ar":"رفحاء","en":"Rafha","p":"R:Northern Region","comp":57,"vd":95897},{"id":"C:Northern Region/طريف","ar":"طريف","en":"Turaif","p":"R:Northern Region","comp":59,"vd":85497},{"id":"C:Jawf/سكاكا","ar":"سكاكا","en":"Sakaka","p":"R:Jawf","comp":55,"vd":170670},{"id":"C:Jawf/القريات","ar":"القريات","en":"Qurayyat","p":"R:Jawf","comp":56,"vd":146338},{"id":"C:Jawf/دومة الجندل","ar":"دومة الجندل","en":"Dumat al-Jandal","p":"R:Jawf","comp":47,"vd":92242},{"id":"C:Hail/حائل","ar":"حائل","en":"Hail","p":"R:Hail","comp":64,"vd":242480},{"id":"C:Hail/بقعاء","ar":"بقعاء","en":"Baqaa","p":"R:Hail","comp":68,"vd":133191},{"id":"C:Hail/الغزالة","ar":"الغزالة","en":"Al Ghazalah","p":"R:Hail","comp":47,"vd":115724},{"id":"C:Bahah/الباحة","ar":"الباحة","en":"Al Bahah","p":"R:Bahah","comp":65,"vd":141930},{"id":"C:Bahah/بلجرشي","ar":"بلجرشي","en":"Baljurashi","p":"R:Bahah","comp":53,"vd":146640},{"id":"C:Bahah/المندق","ar":"المندق","en":"Al Mandaq","p":"R:Bahah","comp":48,"vd":106789},{"id":"C:Jizan/جازان","ar":"جازان","en":"Jazan","p":"R:Jizan","comp":61,"vd":564242},{"id":"C:Jizan/صبيا","ar":"صبيا","en":"Sabya","p":"R:Jizan","comp":53,"vd":387194},{"id":"C:Jizan/أبو عريش","ar":"أبو عريش","en":"Abu Arish","p":"R:Jizan","comp":38,"vd":336591},{"id":"C:Jizan/فرسان","ar":"فرسان","en":"Farasan","p":"R:Jizan","comp":45,"vd":227498},{"id":"C:Asir/أبها","ar":"أبها","en":"Abha","p":"R:Asir","comp":54,"vd":822254},{"id":"C:Asir/خميس مشيط","ar":"خميس مشيط","en":"Khamis Mushait","p":"R:Asir","comp":64,"vd":466698},{"id":"C:Asir/بيشة","ar":"بيشة","en":"Bisha","p":"R:Asir","comp":65,"vd":417030},{"id":"C:Asir/النماص","ar":"النماص","en":"An Namas","p":"R:Asir","comp":49,"vd":405721},{"id":"C:Najran/نجران","ar":"نجران","en":"Najran","p":"R:Najran","comp":58,"vd":252689},{"id":"C:Najran/شرورة","ar":"شرورة","en":"Sharurah","p":"R:Najran","comp":52,"vd":154490},{"id":"C:Najran/حبونا","ar":"حبونا","en":"Habuna","p":"R:Najran","comp":45,"vd":108218},{"id":"C:Eastern Region/الدمام","ar":"الدمام","en":"Dammam","p":"R:Eastern Region","comp":65,"vd":1636831},{"id":"C:Eastern Region/الخبر","ar":"الخبر","en":"Khobar","p":"R:Eastern Region","comp":76,"vd":966155},{"id":"C:Eastern Region/الأحساء","ar":"الأحساء","en":"Al Ahsa","p":"R:Eastern Region","comp":67,"vd":835238},{"id":"C:Eastern Region/الجبيل","ar":"الجبيل","en":"Jubail","p":"R:Eastern Region","comp":65,"vd":515423},{"id":"C:Eastern Region/القطيف","ar":"القطيف","en":"Qatif","p":"R:Eastern Region","comp":62,"vd":531440},{"id":"C:Eastern Region/حفر الباطن","ar":"حفر الباطن","en":"Hafar al-Batin","p":"R:Eastern Region","comp":65,"vd":399672}],"districts":[{"id":"D:العمل","ar":"العمل","en":"Al Amal","p":"C:Riyadh/الرياض","c":[24.64567,46.72451],"pop":117877,"comp":69,"vd":68,"ax":{"health":{"compliance":82,"enforcement":65,"coverage":61},"commercial":{"compliance":79,"enforcement":83,"coverage":85},"construction":{"compliance":65,"enforcement":60,"coverage":64},"excavation":{"compliance":61,"enforcement":59,"coverage":57},"distortion":{"compliance":76,"enforcement":67,"coverage":67}}},{"id":"D:النموذجية","ar":"النموذجية","en":"Al Namudhajiah","p":"C:Riyadh/الرياض","c":[24.65555,46.69467],"pop":90256,"comp":68,"vd":83,"ax":{"health":{"compliance":69,"enforcement":70,"coverage":72},"commercial":{"compliance":73,"enforcement":60,"coverage":66},"construction":{"compliance":78,"enforcement":70,"coverage":71},"excavation":{"compliance":68,"enforcement":62,"coverage":53},"distortion":{"compliance":73,"enforcement":62,"coverage":77}}},{"id":"D:الجرادية","ar":"الجرادية","en":"Al Jaradiah","p":"C:Riyadh/الرياض","c":[24.61788,46.69831],"pop":57324,"comp":65,"vd":35,"ax":{"health":{"compliance":81,"enforcement":70,"coverage":62},"commercial":{"compliance":79,"enforcement":66,"coverage":82},"construction":{"compliance":66,"enforcement":61,"coverage":62},"excavation":{"compliance":66,"enforcement":48,"coverage":44},"distortion":{"compliance":68,"enforcement":62,"coverage":54}}},{"id":"D:الصناعية","ar":"الصناعية","en":"Al Sanaiah","p":"C:Riyadh/الرياض","c":[24.64057,46.74753],"pop":60518,"comp":62,"vd":61,"ax":{"health":{"compliance":84,"enforcement":60,"coverage":67},"commercial":{"compliance":69,"enforcement":70,"coverage":53},"construction":{"compliance":71,"enforcement":58,"coverage":61},"excavation":{"compliance":56,"enforcement":45,"coverage":55},"distortion":{"compliance":66,"enforcement":54,"coverage":57}}},{"id":"D:منفوحة الجديدة","ar":"منفوحة الجديدة","en":"Manafuhah al-Jadidah","p":"C:Riyadh/الرياض","c":[24.61403,46.72289],"pop":83724,"comp":64,"vd":40,"ax":{"health":{"compliance":75,"enforcement":70,"coverage":72},"commercial":{"compliance":77,"enforcement":70,"coverage":68},"construction":{"compliance":53,"enforcement":50,"coverage":58},"excavation":{"compliance":71,"enforcement":51,"coverage":50},"distortion":{"compliance":69,"enforcement":53,"coverage":68}}},{"id":"D:الفاخرية","ar":"الفاخرية","en":"Al Fakhariah","p":"C:Riyadh/الرياض","c":[24.64214,46.68278],"pop":49583,"comp":74,"vd":114,"ax":{"health":{"compliance":97,"enforcement":68,"coverage":78},"commercial":{"compliance":93,"enforcement":81,"coverage":81},"construction":{"compliance":87,"enforcement":64,"coverage":61},"excavation":{"compliance":63,"enforcement":50,"coverage":74},"distortion":{"compliance":70,"enforcement":73,"coverage":67}}},{"id":"D:الديرة","ar":"الديرة","en":"Al Dirah","p":"C:Riyadh/الرياض","c":[24.63397,46.71096],"pop":103336,"comp":57,"vd":74,"ax":{"health":{"compliance":55,"enforcement":63,"coverage":60},"commercial":{"compliance":59,"enforcement":57,"coverage":67},"construction":{"compliance":64,"enforcement":46,"coverage":44},"excavation":{"compliance":64,"enforcement":51,"coverage":40},"distortion":{"compliance":72,"enforcement":45,"coverage":55}}},{"id":"D:ام الحمام الشرقي","ar":"ام الحمام الشرقي","en":"Am al-Hamam al-Sharaqi","p":"C:Riyadh/الرياض","c":[24.69235,46.65565],"pop":19158,"comp":62,"vd":65,"ax":{"health":{"compliance":74,"enforcement":58,"coverage":66},"commercial":{"compliance":84,"enforcement":65,"coverage":79},"construction":{"compliance":66,"enforcement":57,"coverage":52},"excavation":{"compliance":60,"enforcement":41,"coverage":49},"distortion":{"compliance":56,"enforcement":57,"coverage":61}}},{"id":"D:الشرفية","ar":"الشرفية","en":"Al Sharafiah","p":"C:Riyadh/الرياض","c":[24.66071,46.66901],"pop":107243,"comp":68,"vd":51,"ax":{"health":{"compliance":83,"enforcement":70,"coverage":82},"commercial":{"compliance":86,"enforcement":71,"coverage":78},"construction":{"compliance":60,"enforcement":47,"coverage":61},"excavation":{"compliance":72,"enforcement":57,"coverage":62},"distortion":{"compliance":64,"enforcement":56,"coverage":66}}},{"id":"D:الهدا","ar":"الهدا","en":"Al Hada","p":"C:Riyadh/الرياض","c":[24.66109,46.63815],"pop":91790,"comp":61,"vd":117,"ax":{"health":{"compliance":66,"enforcement":53,"coverage":51},"commercial":{"compliance":69,"enforcement":75,"coverage":73},"construction":{"compliance":65,"enforcement":65,"coverage":54},"excavation":{"compliance":58,"enforcement":47,"coverage":54},"distortion":{"compliance":68,"enforcement":57,"coverage":52}}},{"id":"D:المعذر الشمالي","ar":"المعذر الشمالي","en":"Al Madhar al-Shamali","p":"C:Riyadh/الرياض","c":[24.69421,46.66535],"pop":24777,"comp":65,"vd":41,"ax":{"health":{"compliance":80,"enforcement":68,"coverage":74},"commercial":{"compliance":85,"enforcement":65,"coverage":74},"construction":{"compliance":66,"enforcement":46,"coverage":57},"excavation":{"compliance":56,"enforcement":58,"coverage":60},"distortion":{"compliance":73,"enforcement":53,"coverage":61}}},{"id":"D:ام الحمام الغربي","ar":"ام الحمام الغربي","en":"Am al-Hamam al-Gharabi","p":"C:Riyadh/الرياض","c":[24.69098,46.64125],"pop":21946,"comp":62,"vd":22,"ax":{"health":{"compliance":72,"enforcement":68,"coverage":64},"commercial":{"compliance":68,"enforcement":61,"coverage":70},"construction":{"compliance":68,"enforcement":58,"coverage":58},"excavation":{"compliance":50,"enforcement":47,"coverage":45},"distortion":{"compliance":67,"enforcement":58,"coverage":69}}},{"id":"D:الرحمانية","ar":"الرحمانية","en":"Al Rahamaniah","p":"C:Riyadh/الرياض","c":[24.71629,46.6593],"pop":87446,"comp":71,"vd":49,"ax":{"health":{"compliance":91,"enforcement":72,"coverage":85},"commercial":{"compliance":77,"enforcement":77,"coverage":76},"construction":{"compliance":62,"enforcement":57,"coverage":51},"excavation":{"compliance":75,"enforcement":43,"coverage":72},"distortion":{"compliance":79,"enforcement":66,"coverage":85}}},{"id":"D:لبن","ar":"لبن","en":"Laban","p":"C:Riyadh/الرياض","c":[24.63252,46.6166],"pop":57482,"comp":56,"vd":33,"ax":{"health":{"compliance":71,"enforcement":66,"coverage":55},"commercial":{"compliance":54,"enforcement":50,"coverage":48},"construction":{"compliance":60,"enforcement":47,"coverage":45},"excavation":{"compliance":53,"enforcement":63,"coverage":48},"distortion":{"compliance":67,"enforcement":46,"coverage":48}}},{"id":"D:الرفيعة","ar":"الرفيعة","en":"Al Rafiah","p":"C:Riyadh/الرياض","c":[24.63797,46.6607],"pop":117572,"comp":67,"vd":86,"ax":{"health":{"compliance":84,"enforcement":57,"coverage":69},"commercial":{"compliance":82,"enforcement":76,"coverage":67},"construction":{"compliance":66,"enforcement":56,"coverage":64},"excavation":{"compliance":67,"enforcement":59,"coverage":61},"distortion":{"compliance":65,"enforcement":73,"coverage":55}}},{"id":"D:الشهداء","ar":"الشهداء","en":"Al Shahada","p":"C:Riyadh/الرياض","c":[24.78817,46.73543],"pop":11497,"comp":65,"vd":22,"ax":{"health":{"compliance":77,"enforcement":57,"coverage":56},"commercial":{"compliance":76,"enforcement":75,"coverage":73},"construction":{"compliance":62,"enforcement":69,"coverage":62},"excavation":{"compliance":66,"enforcement":55,"coverage":51},"distortion":{"compliance":66,"enforcement":57,"coverage":64}}},{"id":"D:الملك فهد","ar":"الملك فهد","en":"Al Malak Fahad","p":"C:Riyadh/الرياض","c":[24.74062,46.67037],"pop":24081,"comp":71,"vd":20,"ax":{"health":{"compliance":90,"enforcement":68,"coverage":76},"commercial":{"compliance":68,"enforcement":78,"coverage":64},"construction":{"compliance":88,"enforcement":73,"coverage":81},"excavation":{"compliance":62,"enforcement":44,"coverage":53},"distortion":{"compliance":88,"enforcement":68,"coverage":61}}},{"id":"D:السويدي","ar":"السويدي","en":"Al Suidi","p":"C:Riyadh/الرياض","c":[24.59151,46.67025],"pop":116863,"comp":55,"vd":127,"ax":{"health":{"compliance":76,"enforcement":54,"coverage":68},"commercial":{"compliance":55,"enforcement":50,"coverage":53},"construction":{"compliance":59,"enforcement":46,"coverage":54},"excavation":{"compliance":57,"enforcement":40,"coverage":36},"distortion":{"compliance":65,"enforcement":57,"coverage":51}}},{"id":"D:الحزم","ar":"الحزم","en":"Al Hazam","p":"C:Riyadh/الرياض","c":[24.53886,46.64219],"pop":47273,"comp":62,"vd":48,"ax":{"health":{"compliance":82,"enforcement":68,"coverage":69},"commercial":{"compliance":62,"enforcement":51,"coverage":67},"construction":{"compliance":71,"enforcement":54,"coverage":59},"excavation":{"compliance":59,"enforcement":50,"coverage":55},"distortion":{"compliance":61,"enforcement":57,"coverage":59}}},{"id":"D:عتيقة","ar":"عتيقة","en":"Atiqah","p":"C:Riyadh/الرياض","c":[24.60178,46.70785],"pop":12948,"comp":64,"vd":29,"ax":{"health":{"compliance":67,"enforcement":60,"coverage":71},"commercial":{"compliance":75,"enforcement":60,"coverage":61},"construction":{"compliance":74,"enforcement":69,"coverage":60},"excavation":{"compliance":52,"enforcement":45,"coverage":53},"distortion":{"compliance":79,"enforcement":57,"coverage":64}}},{"id":"D:المربع","ar":"المربع","en":"Al Maraba","p":"C:Riyadh/الرياض","c":[24.65516,46.70898],"pop":30767,"comp":60,"vd":79,"ax":{"health":{"compliance":79,"enforcement":59,"coverage":66},"commercial":{"compliance":71,"enforcement":46,"coverage":65},"construction":{"compliance":64,"enforcement":59,"coverage":55},"excavation":{"compliance":59,"enforcement":48,"coverage":58},"distortion":{"compliance":69,"enforcement":45,"coverage":53}}},{"id":"D:الفلاح","ar":"الفلاح","en":"Al Falah","p":"C:Riyadh/الرياض","c":[24.797,46.70923],"pop":102137,"comp":57,"vd":85,"ax":{"health":{"compliance":65,"enforcement":51,"coverage":57},"commercial":{"compliance":70,"enforcement":62,"coverage":67},"construction":{"compliance":58,"enforcement":52,"coverage":59},"excavation":{"compliance":60,"enforcement":46,"coverage":49},"distortion":{"compliance":57,"enforcement":41,"coverage":62}}},{"id":"D:الندى","ar":"الندى","en":"Al Nada","p":"C:Riyadh/الرياض","c":[24.80584,46.68297],"pop":22311,"comp":75,"vd":49,"ax":{"health":{"compliance":87,"enforcement":84,"coverage":73},"commercial":{"compliance":71,"enforcement":59,"coverage":70},"construction":{"compliance":78,"enforcement":76,"coverage":78},"excavation":{"compliance":81,"enforcement":74,"coverage":72},"distortion":{"compliance":73,"enforcement":69,"coverage":79}}},{"id":"D:المرسلات","ar":"المرسلات","en":"Al Marasalat","p":"C:Riyadh/الرياض","c":[24.74885,46.68992],"pop":84463,"comp":67,"vd":93,"ax":{"health":{"compliance":70,"enforcement":67,"coverage":62},"commercial":{"compliance":81,"enforcement":56,"coverage":64},"construction":{"compliance":77,"enforcement":56,"coverage":65},"excavation":{"compliance":64,"enforcement":51,"coverage":62},"distortion":{"compliance":79,"enforcement":67,"coverage":67}}},{"id":"D:النزهة","ar":"النزهة","en":"Al Nazahah","p":"C:Riyadh/الرياض","c":[24.75645,46.70789],"pop":106272,"comp":67,"vd":28,"ax":{"health":{"compliance":78,"enforcement":65,"coverage":81},"commercial":{"compliance":84,"enforcement":66,"coverage":78},"construction":{"compliance":61,"enforcement":71,"coverage":64},"excavation":{"compliance":63,"enforcement":59,"coverage":52},"distortion":{"compliance":72,"enforcement":50,"coverage":64}}},{"id":"D:الورود","ar":"الورود","en":"Al Urud","p":"C:Riyadh/الرياض","c":[24.72458,46.67847],"pop":53934,"comp":60,"vd":16,"ax":{"health":{"compliance":73,"enforcement":51,"coverage":60},"commercial":{"compliance":71,"enforcement":51,"coverage":56},"construction":{"compliance":65,"enforcement":61,"coverage":58},"excavation":{"compliance":61,"enforcement":39,"coverage":58},"distortion":{"compliance":61,"enforcement":69,"coverage":61}}},{"id":"D:الملك فيصل","ar":"الملك فيصل","en":"Al Malak Fisal","p":"C:Riyadh/الرياض","c":[24.76222,46.77479],"pop":61800,"comp":57,"vd":31,"ax":{"health":{"compliance":81,"enforcement":56,"coverage":66},"commercial":{"compliance":77,"enforcement":56,"coverage":65},"construction":{"compliance":50,"enforcement":40,"coverage":50},"excavation":{"compliance":55,"enforcement":42,"coverage":55},"distortion":{"compliance":59,"enforcement":51,"coverage":54}}},{"id":"D:المدينة الصناعية الثانية","ar":"المدينة الصناعية الثانية","en":"Al Madinah al-Sanaiah al-Thaniah","p":"C:Riyadh/الرياض","c":[24.5402,46.90503],"pop":41473,"comp":57,"vd":50,"ax":{"health":{"compliance":66,"enforcement":59,"coverage":57},"commercial":{"compliance":73,"enforcement":53,"coverage":75},"construction":{"compliance":59,"enforcement":46,"coverage":57},"excavation":{"compliance":50,"enforcement":40,"coverage":54},"distortion":{"compliance":71,"enforcement":45,"coverage":54}}},{"id":"D:العزيزية","ar":"العزيزية","en":"Al Aziziah","p":"C:Riyadh/الرياض","c":[24.58554,46.77471],"pop":28130,"comp":58,"vd":88,"ax":{"health":{"compliance":77,"enforcement":75,"coverage":67},"commercial":{"compliance":56,"enforcement":56,"coverage":51},"construction":{"compliance":70,"enforcement":59,"coverage":54},"excavation":{"compliance":52,"enforcement":43,"coverage":54},"distortion":{"compliance":57,"enforcement":39,"coverage":48}}},{"id":"D:المنصورة","ar":"المنصورة","en":"Al Manasurah","p":"C:Riyadh/الرياض","c":[24.60933,46.74575],"pop":47564,"comp":57,"vd":111,"ax":{"health":{"compliance":69,"enforcement":66,"coverage":63},"commercial":{"compliance":57,"enforcement":54,"coverage":56},"construction":{"compliance":52,"enforcement":48,"coverage":50},"excavation":{"compliance":57,"enforcement":49,"coverage":60},"distortion":{"compliance":69,"enforcement":46,"coverage":59}}},{"id":"D:غبيرة","ar":"غبيرة","en":"Ghabirah","p":"C:Riyadh/الرياض","c":[24.61934,46.73661],"pop":22310,"comp":70,"vd":7,"ax":{"health":{"compliance":89,"enforcement":63,"coverage":79},"commercial":{"compliance":68,"enforcement":68,"coverage":67},"construction":{"compliance":77,"enforcement":67,"coverage":64},"excavation":{"compliance":66,"enforcement":62,"coverage":60},"distortion":{"compliance":77,"enforcement":70,"coverage":67}}},{"id":"D:الفاروق","ar":"الفاروق","en":"Al Faruq","p":"C:Riyadh/الرياض","c":[24.65382,46.77324],"pop":27726,"comp":71,"vd":94,"ax":{"health":{"compliance":89,"enforcement":64,"coverage":68},"commercial":{"compliance":78,"enforcement":68,"coverage":77},"construction":{"compliance":71,"enforcement":69,"coverage":71},"excavation":{"compliance":78,"enforcement":60,"coverage":73},"distortion":{"compliance":69,"enforcement":58,"coverage":81}}},{"id":"D:الفيصلية","ar":"الفيصلية","en":"Al Fisaliah","p":"C:Riyadh/الرياض","c":[24.63553,46.78117],"pop":97412,"comp":67,"vd":39,"ax":{"health":{"compliance":75,"enforcement":68,"coverage":66},"commercial":{"compliance":84,"enforcement":69,"coverage":81},"construction":{"compliance":67,"enforcement":59,"coverage":72},"excavation":{"compliance":61,"enforcement":64,"coverage":44},"distortion":{"compliance":72,"enforcement":56,"coverage":72}}},{"id":"D:الخالدية","ar":"الخالدية","en":"Al Khaladiah","p":"C:Riyadh/الرياض","c":[24.61958,46.75806],"pop":113776,"comp":49,"vd":108,"ax":{"health":{"compliance":67,"enforcement":52,"coverage":52},"commercial":{"compliance":66,"enforcement":58,"coverage":43},"construction":{"compliance":59,"enforcement":40,"coverage":44},"excavation":{"compliance":40,"enforcement":28,"coverage":39},"distortion":{"compliance":51,"enforcement":42,"coverage":41}}},{"id":"D:الجزيرة","ar":"الجزيرة","en":"Al Jazirah","p":"C:Riyadh/الرياض","c":[24.6657,46.79625],"pop":32678,"comp":59,"vd":106,"ax":{"health":{"compliance":77,"enforcement":61,"coverage":72},"commercial":{"compliance":59,"enforcement":63,"coverage":56},"construction":{"compliance":60,"enforcement":45,"coverage":42},"excavation":{"compliance":62,"enforcement":46,"coverage":51},"distortion":{"compliance":62,"enforcement":52,"coverage":65}}},{"id":"D:السعادة","ar":"السعادة","en":"Al Sadah","p":"C:Riyadh/الرياض","c":[24.69816,46.8392],"pop":85906,"comp":70,"vd":89,"ax":{"health":{"compliance":78,"enforcement":70,"coverage":65},"commercial":{"compliance":68,"enforcement":64,"coverage":60},"construction":{"compliance":86,"enforcement":67,"coverage":73},"excavation":{"compliance":77,"enforcement":67,"coverage":68},"distortion":{"compliance":68,"enforcement":56,"coverage":69}}},{"id":"D:الناصرية","ar":"الناصرية","en":"Al Nasariah","p":"C:Riyadh/الرياض","c":[24.6557,46.68247],"pop":97099,"comp":72,"vd":6,"ax":{"health":{"compliance":88,"enforcement":72,"coverage":84},"commercial":{"compliance":84,"enforcement":76,"coverage":69},"construction":{"compliance":77,"enforcement":58,"coverage":64},"excavation":{"compliance":62,"enforcement":61,"coverage":62},"distortion":{"compliance":84,"enforcement":60,"coverage":69}}},{"id":"D:المناخ","ar":"المناخ","en":"Al Manakh","p":"C:Riyadh/الرياض","c":[24.6076,46.80166],"pop":40765,"comp":63,"vd":30,"ax":{"health":{"compliance":76,"enforcement":66,"coverage":64},"commercial":{"compliance":75,"enforcement":53,"coverage":53},"construction":{"compliance":67,"enforcement":61,"coverage":55},"excavation":{"compliance":64,"enforcement":46,"coverage":44},"distortion":{"compliance":68,"enforcement":68,"coverage":62}}},{"id":"D:الدفاع","ar":"الدفاع","en":"Al Dafa","p":"C:Riyadh/الرياض","c":[24.58498,46.83329],"pop":98123,"comp":70,"vd":67,"ax":{"health":{"compliance":77,"enforcement":80,"coverage":69},"commercial":{"compliance":76,"enforcement":71,"coverage":67},"construction":{"compliance":82,"enforcement":68,"coverage":64},"excavation":{"compliance":66,"enforcement":55,"coverage":67},"distortion":{"compliance":77,"enforcement":65,"coverage":59}}},{"id":"D:النور","ar":"النور","en":"Al Nur","p":"C:Riyadh/الرياض","c":[24.63068,46.81565],"pop":87306,"comp":64,"vd":11,"ax":{"health":{"compliance":77,"enforcement":63,"coverage":75},"commercial":{"compliance":60,"enforcement":58,"coverage":54},"construction":{"compliance":65,"enforcement":51,"coverage":62},"excavation":{"compliance":72,"enforcement":62,"coverage":61},"distortion":{"compliance":72,"enforcement":60,"coverage":51}}},{"id":"D:الملك عبدالله","ar":"الملك عبدالله","en":"Al Malak Abadalalah","p":"C:Riyadh/الرياض","c":[24.73157,46.74506],"pop":102235,"comp":77,"vd":33,"ax":{"health":{"compliance":91,"enforcement":79,"coverage":90},"commercial":{"compliance":77,"enforcement":70,"coverage":77},"construction":{"compliance":82,"enforcement":70,"coverage":76},"excavation":{"compliance":68,"enforcement":52,"coverage":66},"distortion":{"compliance":90,"enforcement":79,"coverage":85}}},{"id":"D:الواحة","ar":"الواحة","en":"Al Uahah","p":"C:Riyadh/الرياض","c":[24.73971,46.71538],"pop":87823,"comp":63,"vd":73,"ax":{"health":{"compliance":71,"enforcement":68,"coverage":67},"commercial":{"compliance":80,"enforcement":57,"coverage":63},"construction":{"compliance":55,"enforcement":46,"coverage":52},"excavation":{"compliance":69,"enforcement":51,"coverage":50},"distortion":{"compliance":76,"enforcement":59,"coverage":65}}},{"id":"D:صلاح الدين","ar":"صلاح الدين","en":"Salah al-Din","p":"C:Riyadh/الرياض","c":[24.72978,46.69805],"pop":61605,"comp":60,"vd":57,"ax":{"health":{"compliance":67,"enforcement":66,"coverage":72},"commercial":{"compliance":72,"enforcement":57,"coverage":58},"construction":{"compliance":58,"enforcement":58,"coverage":65},"excavation":{"compliance":56,"enforcement":55,"coverage":43},"distortion":{"compliance":63,"enforcement":49,"coverage":52}}},{"id":"D:الملك عبدالعزيز","ar":"الملك عبدالعزيز","en":"Al Malak Abadalaziz","p":"C:Riyadh/الرياض","c":[24.72119,46.71707],"pop":46223,"comp":70,"vd":38,"ax":{"health":{"compliance":83,"enforcement":80,"coverage":66},"commercial":{"compliance":73,"enforcement":62,"coverage":56},"construction":{"compliance":71,"enforcement":66,"coverage":67},"excavation":{"compliance":74,"enforcement":62,"coverage":68},"distortion":{"compliance":70,"enforcement":71,"coverage":68}}},{"id":"D:الوزارات","ar":"الوزارات","en":"Al Uzarat","p":"C:Riyadh/الرياض","c":[24.67622,46.71358],"pop":107633,"comp":67,"vd":77,"ax":{"health":{"compliance":87,"enforcement":82,"coverage":82},"commercial":{"compliance":80,"enforcement":62,"coverage":55},"construction":{"compliance":72,"enforcement":60,"coverage":73},"excavation":{"compliance":57,"enforcement":63,"coverage":55},"distortion":{"compliance":63,"enforcement":53,"coverage":58}}},{"id":"D:سكيرينة","ar":"سكيرينة","en":"Sakirinah","p":"C:Riyadh/الرياض","c":[24.61736,46.71741],"pop":50211,"comp":57,"vd":45,"ax":{"health":{"compliance":81,"enforcement":54,"coverage":75},"commercial":{"compliance":67,"enforcement":46,"coverage":65},"construction":{"compliance":55,"enforcement":58,"coverage":51},"excavation":{"compliance":53,"enforcement":43,"coverage":56},"distortion":{"compliance":59,"enforcement":48,"coverage":49}}},{"id":"D:الربوة","ar":"الربوة","en":"Al Rabuah","p":"C:Riyadh/الرياض","c":[24.6915,46.75333],"pop":115278,"comp":70,"vd":42,"ax":{"health":{"compliance":74,"enforcement":69,"coverage":64},"commercial":{"compliance":76,"enforcement":63,"coverage":68},"construction":{"compliance":83,"enforcement":71,"coverage":58},"excavation":{"compliance":70,"enforcement":69,"coverage":59},"distortion":{"compliance":83,"enforcement":67,"coverage":64}}},{"id":"D:جرير","ar":"جرير","en":"Jarir","p":"C:Riyadh/الرياض","c":[24.6774,46.7508],"pop":25346,"comp":69,"vd":52,"ax":{"health":{"compliance":92,"enforcement":66,"coverage":66},"commercial":{"compliance":79,"enforcement":73,"coverage":79},"construction":{"compliance":67,"enforcement":76,"coverage":70},"excavation":{"compliance":55,"enforcement":53,"coverage":62},"distortion":{"compliance":77,"enforcement":56,"coverage":61}}},{"id":"D:المعذر","ar":"المعذر","en":"Al Madhar","p":"C:Riyadh/الرياض","c":[24.66816,46.67213],"pop":35919,"comp":56,"vd":35,"ax":{"health":{"compliance":72,"enforcement":57,"coverage":68},"commercial":{"compliance":71,"enforcement":58,"coverage":53},"construction":{"compliance":61,"enforcement":43,"coverage":48},"excavation":{"compliance":62,"enforcement":44,"coverage":42},"distortion":{"compliance":53,"enforcement":51,"coverage":51}}},{"id":"D:الصالحية","ar":"الصالحية","en":"Al Salahiah","p":"C:Riyadh/الرياض","c":[24.63297,46.73463],"pop":100056,"comp":54,"vd":60,"ax":{"health":{"compliance":63,"enforcement":56,"coverage":55},"commercial":{"compliance":62,"enforcement":63,"coverage":66},"construction":{"compliance":58,"enforcement":39,"coverage":38},"excavation":{"compliance":47,"enforcement":37,"coverage":45},"distortion":{"compliance":73,"enforcement":53,"coverage":54}}},{"id":"D:الملز","ar":"الملز","en":"Al Malaz","p":"C:Riyadh/الرياض","c":[24.66057,46.73437],"pop":15856,"comp":60,"vd":44,"ax":{"health":{"compliance":76,"enforcement":58,"coverage":57},"commercial":{"compliance":65,"enforcement":59,"coverage":57},"construction":{"compliance":73,"enforcement":52,"coverage":59},"excavation":{"compliance":55,"enforcement":51,"coverage":50},"distortion":{"compliance":61,"enforcement":64,"coverage":59}}},{"id":"D:منفوحة","ar":"منفوحة","en":"Manafuhah","p":"C:Riyadh/الرياض","c":[24.60112,46.72738],"pop":107360,"comp":63,"vd":25,"ax":{"health":{"compliance":89,"enforcement":71,"coverage":64},"commercial":{"compliance":65,"enforcement":63,"coverage":53},"construction":{"compliance":68,"enforcement":61,"coverage":55},"excavation":{"compliance":58,"enforcement":47,"coverage":59},"distortion":{"compliance":65,"enforcement":59,"coverage":69}}},{"id":"D:عليشة","ar":"عليشة","en":"Alishah","p":"C:Riyadh/الرياض","c":[24.63011,46.68379],"pop":84164,"comp":60,"vd":144,"ax":{"health":{"compliance":80,"enforcement":65,"coverage":61},"commercial":{"compliance":80,"enforcement":62,"coverage":59},"construction":{"compliance":48,"enforcement":53,"coverage":45},"excavation":{"compliance":70,"enforcement":46,"coverage":56},"distortion":{"compliance":61,"enforcement":51,"coverage":59}}},{"id":"D:النهضة","ar":"النهضة","en":"Al Nahadah","p":"C:Riyadh/الرياض","c":[24.7608,46.8159],"pop":72999,"comp":68,"vd":24,"ax":{"health":{"compliance":83,"enforcement":76,"coverage":73},"commercial":{"compliance":72,"enforcement":59,"coverage":56},"construction":{"compliance":74,"enforcement":69,"coverage":63},"excavation":{"compliance":60,"enforcement":68,"coverage":61},"distortion":{"compliance":69,"enforcement":61,"coverage":63}}},{"id":"D:الخليج","ar":"الخليج","en":"Al Khalij","p":"C:Riyadh/الرياض","c":[24.77826,46.80434],"pop":91949,"comp":72,"vd":74,"ax":{"health":{"compliance":73,"enforcement":71,"coverage":66},"commercial":{"compliance":79,"enforcement":85,"coverage":71},"construction":{"compliance":69,"enforcement":74,"coverage":64},"excavation":{"compliance":71,"enforcement":56,"coverage":69},"distortion":{"compliance":86,"enforcement":61,"coverage":69}}},{"id":"D:الضباط","ar":"الضباط","en":"Al Dabat","p":"C:Riyadh/الرياض","c":[24.67974,46.72219],"pop":28612,"comp":63,"vd":4,"ax":{"health":{"compliance":79,"enforcement":59,"coverage":66},"commercial":{"compliance":70,"enforcement":59,"coverage":54},"construction":{"compliance":79,"enforcement":58,"coverage":69},"excavation":{"compliance":62,"enforcement":46,"coverage":47},"distortion":{"compliance":71,"enforcement":59,"coverage":52}}},{"id":"D:السويدي الغربي","ar":"السويدي الغربي","en":"Al Suidi al-Gharabi","p":"C:Riyadh/الرياض","c":[24.57492,46.62076],"pop":50972,"comp":55,"vd":78,"ax":{"health":{"compliance":63,"enforcement":53,"coverage":58},"commercial":{"compliance":72,"enforcement":53,"coverage":61},"construction":{"compliance":65,"enforcement":51,"coverage":47},"excavation":{"compliance":57,"enforcement":40,"coverage":38},"distortion":{"compliance":59,"enforcement":40,"coverage":49}}},{"id":"D:ديراب","ar":"ديراب","en":"Dirab","p":"C:Riyadh/الرياض","c":[24.51074,46.61739],"pop":96781,"comp":53,"vd":108,"ax":{"health":{"compliance":66,"enforcement":50,"coverage":53},"commercial":{"compliance":54,"enforcement":50,"coverage":53},"construction":{"compliance":55,"enforcement":63,"coverage":54},"excavation":{"compliance":49,"enforcement":45,"coverage":41},"distortion":{"compliance":59,"enforcement":56,"coverage":42}}},{"id":"D:احد","ar":"احد","en":"Ahad","p":"C:Riyadh/الرياض","c":[24.49008,46.63829],"pop":84598,"comp":60,"vd":82,"ax":{"health":{"compliance":72,"enforcement":57,"coverage":58},"commercial":{"compliance":77,"enforcement":50,"coverage":68},"construction":{"compliance":57,"enforcement":56,"coverage":47},"excavation":{"compliance":60,"enforcement":45,"coverage":50},"distortion":{"compliance":75,"enforcement":60,"coverage":57}}},{"id":"D:نمار","ar":"نمار","en":"Namar","p":"C:Riyadh/الرياض","c":[24.56843,46.67552],"pop":45446,"comp":67,"vd":74,"ax":{"health":{"compliance":79,"enforcement":69,"coverage":63},"commercial":{"compliance":79,"enforcement":68,"coverage":69},"construction":{"compliance":63,"enforcement":54,"coverage":58},"excavation":{"compliance":64,"enforcement":64,"coverage":55},"distortion":{"compliance":71,"enforcement":60,"coverage":69}}},{"id":"D:الشفا","ar":"الشفا","en":"Al Shafa","p":"C:Riyadh/الرياض","c":[24.56132,46.69378],"pop":107684,"comp":68,"vd":64,"ax":{"health":{"compliance":83,"enforcement":69,"coverage":73},"commercial":{"compliance":73,"enforcement":53,"coverage":69},"construction":{"compliance":75,"enforcement":54,"coverage":73},"excavation":{"compliance":68,"enforcement":52,"coverage":73},"distortion":{"compliance":73,"enforcement":67,"coverage":52}}},{"id":"D:المحمدية","ar":"المحمدية","en":"Al Mahamadiah","p":"C:Riyadh/الرياض","c":[24.73154,46.6501],"pop":80678,"comp":56,"vd":33,"ax":{"health":{"compliance":77,"enforcement":64,"coverage":59},"commercial":{"compliance":69,"enforcement":50,"coverage":61},"construction":{"compliance":60,"enforcement":44,"coverage":60},"excavation":{"compliance":54,"enforcement":38,"coverage":43},"distortion":{"compliance":58,"enforcement":43,"coverage":47}}},{"id":"D:السليمانية","ar":"السليمانية","en":"Al Salimaniah","p":"C:Riyadh/الرياض","c":[24.7016,46.70539],"pop":85206,"comp":71,"vd":58,"ax":{"health":{"compliance":88,"enforcement":60,"coverage":73},"commercial":{"compliance":72,"enforcement":68,"coverage":65},"construction":{"compliance":76,"enforcement":55,"coverage":67},"excavation":{"compliance":76,"enforcement":67,"coverage":63},"distortion":{"compliance":86,"enforcement":63,"coverage":76}}},{"id":"D:المروة","ar":"المروة","en":"Al Maruah","p":"C:Riyadh/الرياض","c":[24.54067,46.67578],"pop":112756,"comp":59,"vd":47,"ax":{"health":{"compliance":65,"enforcement":61,"coverage":54},"commercial":{"compliance":69,"enforcement":55,"coverage":64},"construction":{"compliance":66,"enforcement":48,"coverage":50},"excavation":{"compliance":54,"enforcement":54,"coverage":64},"distortion":{"compliance":64,"enforcement":53,"coverage":58}}},{"id":"D:عكاظ","ar":"عكاظ","en":"Akaz","p":"C:Riyadh/الرياض","c":[24.51094,46.66446],"pop":79926,"comp":67,"vd":73,"ax":{"health":{"compliance":64,"enforcement":66,"coverage":66},"commercial":{"compliance":79,"enforcement":71,"coverage":61},"construction":{"compliance":77,"enforcement":60,"coverage":59},"excavation":{"compliance":69,"enforcement":56,"coverage":68},"distortion":{"compliance":65,"enforcement":68,"coverage":63}}},{"id":"D:شبرا","ar":"شبرا","en":"Shabara","p":"C:Riyadh/الرياض","c":[24.57739,46.67079],"pop":72480,"comp":59,"vd":74,"ax":{"health":{"compliance":59,"enforcement":67,"coverage":73},"commercial":{"compliance":75,"enforcement":55,"coverage":71},"construction":{"compliance":59,"enforcement":56,"coverage":56},"excavation":{"compliance":57,"enforcement":46,"coverage":53},"distortion":{"compliance":64,"enforcement":45,"coverage":53}}},{"id":"D:الزهرة","ar":"الزهرة","en":"Al Zaharah","p":"C:Riyadh/الرياض","c":[24.57866,46.64575],"pop":25680,"comp":56,"vd":107,"ax":{"health":{"compliance":64,"enforcement":64,"coverage":65},"commercial":{"compliance":70,"enforcement":47,"coverage":56},"construction":{"compliance":65,"enforcement":47,"coverage":42},"excavation":{"compliance":62,"enforcement":39,"coverage":45},"distortion":{"compliance":67,"enforcement":48,"coverage":49}}},{"id":"D:صياح","ar":"صياح","en":"Siah","p":"C:Riyadh/الرياض","c":[24.60739,46.70177],"pop":75445,"comp":54,"vd":63,"ax":{"health":{"compliance":71,"enforcement":50,"coverage":62},"commercial":{"compliance":76,"enforcement":59,"coverage":61},"construction":{"compliance":50,"enforcement":49,"coverage":40},"excavation":{"compliance":46,"enforcement":41,"coverage":45},"distortion":{"compliance":55,"enforcement":51,"coverage":53}}},{"id":"D:سلطانة","ar":"سلطانة","en":"Salatanah","p":"C:Riyadh/الرياض","c":[24.60522,46.68823],"pop":55734,"comp":55,"vd":102,"ax":{"health":{"compliance":69,"enforcement":62,"coverage":51},"commercial":{"compliance":60,"enforcement":53,"coverage":57},"construction":{"compliance":60,"enforcement":54,"coverage":51},"excavation":{"compliance":55,"enforcement":37,"coverage":44},"distortion":{"compliance":62,"enforcement":56,"coverage":47}}},{"id":"D:اليمامة","ar":"اليمامة","en":"Al Imamah","p":"C:Riyadh/الرياض","c":[24.598,46.71673],"pop":104116,"comp":68,"vd":70,"ax":{"health":{"compliance":85,"enforcement":71,"coverage":80},"commercial":{"compliance":69,"enforcement":68,"coverage":64},"construction":{"compliance":68,"enforcement":53,"coverage":64},"excavation":{"compliance":66,"enforcement":69,"coverage":62},"distortion":{"compliance":64,"enforcement":63,"coverage":67}}},{"id":"D:البديعة","ar":"البديعة","en":"Al Badiah","p":"C:Riyadh/الرياض","c":[24.61638,46.68048],"pop":36650,"comp":71,"vd":6,"ax":{"health":{"compliance":84,"enforcement":76,"coverage":75},"commercial":{"compliance":76,"enforcement":58,"coverage":69},"construction":{"compliance":73,"enforcement":53,"coverage":61},"excavation":{"compliance":74,"enforcement":68,"coverage":79},"distortion":{"compliance":82,"enforcement":70,"coverage":67}}},{"id":"D:المصانع","ar":"المصانع","en":"Al Masana","p":"C:Riyadh/الرياض","c":[24.55639,46.74747],"pop":57218,"comp":55,"vd":97,"ax":{"health":{"compliance":58,"enforcement":57,"coverage":54},"commercial":{"compliance":70,"enforcement":62,"coverage":52},"construction":{"compliance":57,"enforcement":44,"coverage":55},"excavation":{"compliance":56,"enforcement":34,"coverage":44},"distortion":{"compliance":64,"enforcement":56,"coverage":52}}},{"id":"D:القادسية","ar":"القادسية","en":"Al Qadasiah","p":"C:Riyadh/الرياض","c":[24.82147,46.8233],"pop":95750,"comp":68,"vd":77,"ax":{"health":{"compliance":74,"enforcement":65,"coverage":71},"commercial":{"compliance":76,"enforcement":73,"coverage":69},"construction":{"compliance":84,"enforcement":68,"coverage":75},"excavation":{"compliance":59,"enforcement":53,"coverage":57},"distortion":{"compliance":61,"enforcement":67,"coverage":67}}},{"id":"D:الصفا","ar":"الصفا","en":"Al Safa","p":"C:Riyadh/الرياض","c":[24.66652,46.76615],"pop":50146,"comp":66,"vd":99,"ax":{"health":{"compliance":76,"enforcement":67,"coverage":76},"commercial":{"compliance":64,"enforcement":58,"coverage":71},"construction":{"compliance":78,"enforcement":65,"coverage":69},"excavation":{"compliance":65,"enforcement":55,"coverage":64},"distortion":{"compliance":74,"enforcement":52,"coverage":53}}},{"id":"D:العليا","ar":"العليا","en":"Al Alia","p":"C:Riyadh/الرياض","c":[24.68939,46.68677],"pop":83514,"comp":59,"vd":75,"ax":{"health":{"compliance":68,"enforcement":63,"coverage":82},"commercial":{"compliance":66,"enforcement":60,"coverage":64},"construction":{"compliance":67,"enforcement":46,"coverage":40},"excavation":{"compliance":55,"enforcement":42,"coverage":53},"distortion":{"compliance":66,"enforcement":53,"coverage":56}}},{"id":"D:الدريهمية","ar":"الدريهمية","en":"Al Darihamiah","p":"C:Riyadh/الرياض","c":[24.5908,46.6972],"pop":110779,"comp":58,"vd":70,"ax":{"health":{"compliance":69,"enforcement":66,"coverage":68},"commercial":{"compliance":73,"enforcement":72,"coverage":69},"construction":{"compliance":57,"enforcement":48,"coverage":63},"excavation":{"compliance":44,"enforcement":48,"coverage":39},"distortion":{"compliance":52,"enforcement":46,"coverage":54}}},{"id":"D:الاسكان","ar":"الاسكان","en":"Al Asakan","p":"C:Riyadh/الرياض","c":[24.57655,46.84557],"pop":97437,"comp":64,"vd":93,"ax":{"health":{"compliance":85,"enforcement":73,"coverage":72},"commercial":{"compliance":74,"enforcement":68,"coverage":57},"construction":{"compliance":57,"enforcement":53,"coverage":62},"excavation":{"compliance":58,"enforcement":46,"coverage":53},"distortion":{"compliance":67,"enforcement":53,"coverage":66}}},{"id":"D:السلام","ar":"السلام","en":"Al Salam","p":"C:Riyadh/الرياض","c":[24.7065,46.81123],"pop":56819,"comp":71,"vd":7,"ax":{"health":{"compliance":83,"enforcement":78,"coverage":83},"commercial":{"compliance":87,"enforcement":66,"coverage":58},"construction":{"compliance":65,"enforcement":55,"coverage":53},"excavation":{"compliance":70,"enforcement":63,"coverage":66},"distortion":{"compliance":80,"enforcement":71,"coverage":76}}},{"id":"D:المنار","ar":"المنار","en":"Al Manar","p":"C:Riyadh/الرياض","c":[24.72532,46.79727],"pop":39197,"comp":75,"vd":99,"ax":{"health":{"compliance":85,"enforcement":69,"coverage":78},"commercial":{"compliance":85,"enforcement":64,"coverage":79},"construction":{"compliance":88,"enforcement":71,"coverage":81},"excavation":{"compliance":83,"enforcement":66,"coverage":65},"distortion":{"compliance":73,"enforcement":59,"coverage":65}}},{"id":"D:النسيم الشرقي","ar":"النسيم الشرقي","en":"Al Nasim al-Sharaqi","p":"C:Riyadh/الرياض","c":[24.74026,46.84479],"pop":95363,"comp":75,"vd":113,"ax":{"health":{"compliance":84,"enforcement":75,"coverage":69},"commercial":{"compliance":77,"enforcement":63,"coverage":70},"construction":{"compliance":83,"enforcement":82,"coverage":70},"excavation":{"compliance":71,"enforcement":61,"coverage":80},"distortion":{"compliance":80,"enforcement":73,"coverage":76}}},{"id":"D:القدس","ar":"القدس","en":"Al Qadas","p":"C:Riyadh/الرياض","c":[24.75649,46.75401],"pop":65748,"comp":65,"vd":107,"ax":{"health":{"compliance":80,"enforcement":65,"coverage":66},"commercial":{"compliance":73,"enforcement":59,"coverage":70},"construction":{"compliance":71,"enforcement":56,"coverage":68},"excavation":{"compliance":65,"enforcement":52,"coverage":53},"distortion":{"compliance":63,"enforcement":57,"coverage":70}}},{"id":"D:الوادي","ar":"الوادي","en":"Al Uadi","p":"C:Riyadh/الرياض","c":[24.78946,46.69124],"pop":104828,"comp":62,"vd":42,"ax":{"health":{"compliance":86,"enforcement":63,"coverage":76},"commercial":{"compliance":63,"enforcement":64,"coverage":52},"construction":{"compliance":47,"enforcement":48,"coverage":46},"excavation":{"compliance":67,"enforcement":63,"coverage":49},"distortion":{"compliance":70,"enforcement":57,"coverage":65}}},{"id":"D:النفل","ar":"النفل","en":"Al Nafal","p":"C:Riyadh/الرياض","c":[24.78188,46.67328],"pop":49458,"comp":80,"vd":74,"ax":{"health":{"compliance":95,"enforcement":79,"coverage":91},"commercial":{"compliance":86,"enforcement":78,"coverage":81},"construction":{"compliance":77,"enforcement":80,"coverage":80},"excavation":{"compliance":80,"enforcement":58,"coverage":70},"distortion":{"compliance":84,"enforcement":81,"coverage":74}}},{"id":"D:المصيف","ar":"المصيف","en":"Al Masif","p":"C:Riyadh/الرياض","c":[24.76547,46.68153],"pop":75564,"comp":74,"vd":23,"ax":{"health":{"compliance":73,"enforcement":76,"coverage":78},"commercial":{"compliance":94,"enforcement":80,"coverage":88},"construction":{"compliance":71,"enforcement":73,"coverage":62},"excavation":{"compliance":66,"enforcement":59,"coverage":76},"distortion":{"compliance":71,"enforcement":76,"coverage":62}}},{"id":"D:التعاون","ar":"التعاون","en":"Al Taun","p":"C:Riyadh/الرياض","c":[24.77305,46.69952],"pop":28676,"comp":70,"vd":55,"ax":{"health":{"compliance":83,"enforcement":82,"coverage":75},"commercial":{"compliance":71,"enforcement":55,"coverage":61},"construction":{"compliance":78,"enforcement":63,"coverage":73},"excavation":{"compliance":63,"enforcement":63,"coverage":46},"distortion":{"compliance":85,"enforcement":69,"coverage":72}}},{"id":"D:الازدهار","ar":"الازدهار","en":"Al Azadahar","p":"C:Riyadh/الرياض","c":[24.78061,46.71748],"pop":37112,"comp":69,"vd":54,"ax":{"health":{"compliance":86,"enforcement":64,"coverage":63},"commercial":{"compliance":76,"enforcement":57,"coverage":67},"construction":{"compliance":65,"enforcement":58,"coverage":66},"excavation":{"compliance":71,"enforcement":70,"coverage":64},"distortion":{"compliance":71,"enforcement":75,"coverage":69}}},{"id":"D:الاندلس","ar":"الاندلس","en":"Al Anadalas","p":"C:Riyadh/الرياض","c":[24.74349,46.78861],"pop":21878,"comp":66,"vd":34,"ax":{"health":{"compliance":79,"enforcement":70,"coverage":65},"commercial":{"compliance":87,"enforcement":71,"coverage":65},"construction":{"compliance":75,"enforcement":66,"coverage":56},"excavation":{"compliance":60,"enforcement":52,"coverage":44},"distortion":{"compliance":57,"enforcement":69,"coverage":62}}},{"id":"D:الروضة","ar":"الروضة","en":"Al Rudah","p":"C:Riyadh/الرياض","c":[24.73513,46.76733],"pop":82354,"comp":74,"vd":15,"ax":{"health":{"compliance":81,"enforcement":80,"coverage":79},"commercial":{"compliance":78,"enforcement":69,"coverage":68},"construction":{"compliance":73,"enforcement":71,"coverage":62},"excavation":{"compliance":79,"enforcement":67,"coverage":73},"distortion":{"compliance":78,"enforcement":66,"coverage":79}}},{"id":"D:الروابي","ar":"الروابي","en":"Al Ruabi","p":"C:Riyadh/الرياض","c":[24.69612,46.79238],"pop":54991,"comp":72,"vd":90,"ax":{"health":{"compliance":82,"enforcement":72,"coverage":63},"commercial":{"compliance":76,"enforcement":63,"coverage":72},"construction":{"compliance":71,"enforcement":65,"coverage":75},"excavation":{"compliance":77,"enforcement":55,"coverage":70},"distortion":{"compliance":87,"enforcement":69,"coverage":68}}},{"id":"D:الريان","ar":"الريان","en":"Al Rian","p":"C:Riyadh/الرياض","c":[24.70743,46.77623],"pop":74036,"comp":60,"vd":112,"ax":{"health":{"compliance":69,"enforcement":64,"coverage":65},"commercial":{"compliance":72,"enforcement":55,"coverage":69},"construction":{"compliance":67,"enforcement":48,"coverage":44},"excavation":{"compliance":65,"enforcement":44,"coverage":54},"distortion":{"compliance":67,"enforcement":46,"coverage":61}}},{"id":"D:ظهرة البديعة","ar":"ظهرة البديعة","en":"Zaharah al-Badiah","p":"C:Riyadh/الرياض","c":[24.59571,46.64507],"pop":41739,"comp":73,"vd":10,"ax":{"health":{"compliance":75,"enforcement":67,"coverage":84},"commercial":{"compliance":73,"enforcement":68,"coverage":77},"construction":{"compliance":76,"enforcement":68,"coverage":69},"excavation":{"compliance":72,"enforcement":78,"coverage":62},"distortion":{"compliance":83,"enforcement":68,"coverage":70}}},{"id":"D:النظيم","ar":"النظيم","en":"Al Nazim","p":"C:Riyadh/الرياض","c":[24.85705,46.96663],"pop":27682,"comp":73,"vd":11,"ax":{"health":{"compliance":85,"enforcement":70,"coverage":86},"commercial":{"compliance":80,"enforcement":76,"coverage":85},"construction":{"compliance":73,"enforcement":61,"coverage":60},"excavation":{"compliance":66,"enforcement":54,"coverage":63},"distortion":{"compliance":87,"enforcement":69,"coverage":72}}},{"id":"D:الرماية","ar":"الرماية","en":"Al Ramaiah","p":"C:Riyadh/الرياض","c":[24.76977,46.8753],"pop":98702,"comp":62,"vd":15,"ax":{"health":{"compliance":61,"enforcement":58,"coverage":64},"commercial":{"compliance":78,"enforcement":58,"coverage":59},"construction":{"compliance":67,"enforcement":58,"coverage":63},"excavation":{"compliance":57,"enforcement":54,"coverage":63},"distortion":{"compliance":63,"enforcement":57,"coverage":62}}},{"id":"D:البرية","ar":"البرية","en":"Al Bariah","p":"C:Riyadh/الرياض","c":[24.54825,46.95851],"pop":51640,"comp":54,"vd":34,"ax":{"health":{"compliance":50,"enforcement":44,"coverage":49},"commercial":{"compliance":68,"enforcement":62,"coverage":51},"construction":{"compliance":65,"enforcement":53,"coverage":44},"excavation":{"compliance":61,"enforcement":51,"coverage":51},"distortion":{"compliance":47,"enforcement":51,"coverage":50}}},{"id":"D:طيبة","ar":"طيبة","en":"Tibah","p":"C:Riyadh/الرياض","c":[24.54211,46.83161],"pop":8637,"comp":68,"vd":107,"ax":{"health":{"compliance":86,"enforcement":78,"coverage":79},"commercial":{"compliance":79,"enforcement":65,"coverage":78},"construction":{"compliance":71,"enforcement":58,"coverage":63},"excavation":{"compliance":59,"enforcement":55,"coverage":65},"distortion":{"compliance":61,"enforcement":56,"coverage":65}}},{"id":"D:المنصورية","ar":"المنصورية","en":"Al Manasuriah","p":"C:Riyadh/الرياض","c":[24.52225,46.79823],"pop":58865,"comp":53,"vd":86,"ax":{"health":{"compliance":58,"enforcement":60,"coverage":67},"commercial":{"compliance":56,"enforcement":58,"coverage":59},"construction":{"compliance":49,"enforcement":54,"coverage":39},"excavation":{"compliance":59,"enforcement":48,"coverage":33},"distortion":{"compliance":49,"enforcement":54,"coverage":42}}},{"id":"D:ضاحية نمار","ar":"ضاحية نمار","en":"Dahiah Namar","p":"C:Riyadh/الرياض","c":[24.49612,46.54108],"pop":50424,"comp":51,"vd":34,"ax":{"health":{"compliance":60,"enforcement":53,"coverage":55},"commercial":{"compliance":68,"enforcement":61,"coverage":55},"construction":{"compliance":49,"enforcement":43,"coverage":43},"excavation":{"compliance":42,"enforcement":36,"coverage":45},"distortion":{"compliance":56,"enforcement":45,"coverage":48}}},{"id":"D:المصفاة","ar":"المصفاة","en":"Al Masafah","p":"C:Riyadh/الرياض","c":[24.48499,46.90951],"pop":118545,"comp":64,"vd":115,"ax":{"health":{"compliance":73,"enforcement":52,"coverage":53},"commercial":{"compliance":76,"enforcement":77,"coverage":73},"construction":{"compliance":67,"enforcement":64,"coverage":65},"excavation":{"compliance":54,"enforcement":55,"coverage":55},"distortion":{"compliance":73,"enforcement":52,"coverage":67}}},{"id":"D:السفارات","ar":"السفارات","en":"Al Safarat","p":"C:Riyadh/الرياض","c":[24.67764,46.62304],"pop":92745,"comp":73,"vd":72,"ax":{"health":{"compliance":78,"enforcement":65,"coverage":85},"commercial":{"compliance":82,"enforcement":70,"coverage":84},"construction":{"compliance":75,"enforcement":62,"coverage":71},"excavation":{"compliance":76,"enforcement":61,"coverage":71},"distortion":{"compliance":86,"enforcement":63,"coverage":74}}},{"id":"D:خشم العان","ar":"خشم العان","en":"Khasham al-An","p":"C:Riyadh/الرياض","c":[24.67629,46.9076],"pop":49785,"comp":51,"vd":155,"ax":{"health":{"compliance":53,"enforcement":37,"coverage":47},"commercial":{"compliance":70,"enforcement":60,"coverage":52},"construction":{"compliance":57,"enforcement":43,"coverage":52},"excavation":{"compliance":55,"enforcement":39,"coverage":50},"distortion":{"compliance":54,"enforcement":53,"coverage":41}}},{"id":"D:قرطبة","ar":"قرطبة","en":"Qaratabah","p":"C:Riyadh/الرياض","c":[24.82221,46.73423],"pop":91915,"comp":72,"vd":58,"ax":{"health":{"compliance":74,"enforcement":72,"coverage":84},"commercial":{"compliance":87,"enforcement":70,"coverage":77},"construction":{"compliance":73,"enforcement":71,"coverage":73},"excavation":{"compliance":66,"enforcement":64,"coverage":71},"distortion":{"compliance":68,"enforcement":63,"coverage":59}}},{"id":"D:طويق","ar":"طويق","en":"Tuiq","p":"C:Riyadh/الرياض","c":[24.56786,46.54058],"pop":54686,"comp":61,"vd":96,"ax":{"health":{"compliance":70,"enforcement":62,"coverage":67},"commercial":{"compliance":58,"enforcement":55,"coverage":58},"construction":{"compliance":72,"enforcement":58,"coverage":56},"excavation":{"compliance":64,"enforcement":43,"coverage":59},"distortion":{"compliance":64,"enforcement":66,"coverage":70}}},{"id":"D:العوالي","ar":"العوالي","en":"Al Auali","p":"C:Riyadh/الرياض","c":[24.55743,46.61825],"pop":34656,"comp":53,"vd":98,"ax":{"health":{"compliance":72,"enforcement":56,"coverage":55},"commercial":{"compliance":67,"enforcement":50,"coverage":55},"construction":{"compliance":58,"enforcement":38,"coverage":53},"excavation":{"compliance":52,"enforcement":42,"coverage":36},"distortion":{"compliance":62,"enforcement":46,"coverage":45}}},{"id":"D:الربيع","ar":"الربيع","en":"Al Rabia","p":"C:Riyadh/الرياض","c":[24.7985,46.6634],"pop":48584,"comp":70,"vd":81,"ax":{"health":{"compliance":73,"enforcement":74,"coverage":69},"commercial":{"compliance":70,"enforcement":67,"coverage":60},"construction":{"compliance":69,"enforcement":64,"coverage":67},"excavation":{"compliance":71,"enforcement":59,"coverage":60},"distortion":{"compliance":77,"enforcement":82,"coverage":82}}},{"id":"D:المغرزات","ar":"المغرزات","en":"Al Magharazat","p":"C:Riyadh/الرياض","c":[24.76422,46.72575],"pop":8446,"comp":75,"vd":6,"ax":{"health":{"compliance":81,"enforcement":75,"coverage":65},"commercial":{"compliance":83,"enforcement":70,"coverage":69},"construction":{"compliance":77,"enforcement":80,"coverage":72},"excavation":{"compliance":69,"enforcement":59,"coverage":65},"distortion":{"compliance":80,"enforcement":82,"coverage":86}}},{"id":"D:السلي","ar":"السلي","en":"Al Sali","p":"C:Riyadh/الرياض","c":[24.65046,46.85706],"pop":88636,"comp":69,"vd":80,"ax":{"health":{"compliance":87,"enforcement":77,"coverage":82},"commercial":{"compliance":73,"enforcement":72,"coverage":62},"construction":{"compliance":64,"enforcement":57,"coverage":69},"excavation":{"compliance":76,"enforcement":46,"coverage":57},"distortion":{"compliance":73,"enforcement":68,"coverage":61}}},{"id":"D:العقيق","ar":"العقيق","en":"Al Aqiq","p":"C:Riyadh/الرياض","c":[24.77361,46.62999],"pop":101352,"comp":60,"vd":94,"ax":{"health":{"compliance":69,"enforcement":65,"coverage":69},"commercial":{"compliance":81,"enforcement":60,"coverage":64},"construction":{"compliance":71,"enforcement":43,"coverage":61},"excavation":{"compliance":55,"enforcement":51,"coverage":46},"distortion":{"compliance":57,"enforcement":47,"coverage":51}}},{"id":"D:النخيل","ar":"النخيل","en":"Al Nakhil","p":"C:Riyadh/الرياض","c":[24.74022,46.60887],"pop":8620,"comp":60,"vd":161,"ax":{"health":{"compliance":70,"enforcement":62,"coverage":67},"commercial":{"compliance":77,"enforcement":60,"coverage":62},"construction":{"compliance":72,"enforcement":59,"coverage":63},"excavation":{"compliance":55,"enforcement":46,"coverage":47},"distortion":{"compliance":58,"enforcement":46,"coverage":60}}},{"id":"D:الغدير","ar":"الغدير","en":"Al Ghadir","p":"C:Riyadh/الرياض","c":[24.77181,46.6546],"pop":67236,"comp":65,"vd":45,"ax":{"health":{"compliance":70,"enforcement":67,"coverage":76},"commercial":{"compliance":80,"enforcement":73,"coverage":62},"construction":{"compliance":67,"enforcement":56,"coverage":53},"excavation":{"compliance":58,"enforcement":61,"coverage":62},"distortion":{"compliance":65,"enforcement":65,"coverage":59}}},{"id":"D:المروج","ar":"المروج","en":"Al Maruj","p":"C:Riyadh/الرياض","c":[24.75723,46.66197],"pop":74659,"comp":69,"vd":49,"ax":{"health":{"compliance":79,"enforcement":73,"coverage":71},"commercial":{"compliance":73,"enforcement":59,"coverage":61},"construction":{"compliance":73,"enforcement":63,"coverage":72},"excavation":{"compliance":63,"enforcement":57,"coverage":68},"distortion":{"compliance":70,"enforcement":75,"coverage":72}}},{"id":"D:العود","ar":"العود","en":"Al Aud","p":"C:Riyadh/الرياض","c":[24.62417,46.72808],"pop":90779,"comp":66,"vd":28,"ax":{"health":{"compliance":75,"enforcement":66,"coverage":65},"commercial":{"compliance":74,"enforcement":53,"coverage":67},"construction":{"compliance":67,"enforcement":64,"coverage":68},"excavation":{"compliance":68,"enforcement":54,"coverage":66},"distortion":{"compliance":71,"enforcement":65,"coverage":63}}},{"id":"D:ثليم","ar":"ثليم","en":"Thalim","p":"C:Riyadh/الرياض","c":[24.64272,46.73084],"pop":49617,"comp":66,"vd":93,"ax":{"health":{"compliance":88,"enforcement":72,"coverage":73},"commercial":{"compliance":86,"enforcement":64,"coverage":65},"construction":{"compliance":56,"enforcement":50,"coverage":64},"excavation":{"compliance":69,"enforcement":56,"coverage":56},"distortion":{"compliance":65,"enforcement":55,"coverage":64}}},{"id":"D:الشميسي","ar":"الشميسي","en":"Al Shamisi","p":"C:Riyadh/الرياض","c":[24.62266,46.70094],"pop":115274,"comp":67,"vd":51,"ax":{"health":{"compliance":80,"enforcement":73,"coverage":67},"commercial":{"compliance":87,"enforcement":72,"coverage":63},"construction":{"compliance":67,"enforcement":52,"coverage":58},"excavation":{"compliance":70,"enforcement":52,"coverage":66},"distortion":{"compliance":64,"enforcement":69,"coverage":52}}},{"id":"D:الوشام","ar":"الوشام","en":"Al Usham","p":"C:Riyadh/الرياض","c":[24.64194,46.69814],"pop":10253,"comp":83,"vd":35,"ax":{"health":{"compliance":95,"enforcement":87,"coverage":88},"commercial":{"compliance":91,"enforcement":81,"coverage":84},"construction":{"compliance":85,"enforcement":73,"coverage":76},"excavation":{"compliance":87,"enforcement":79,"coverage":71},"distortion":{"compliance":86,"enforcement":72,"coverage":82}}},{"id":"D:منتزه سلام","ar":"منتزه سلام","en":"Manatazah Salam","p":"C:Riyadh/الرياض","c":[24.62003,46.70829],"pop":16865,"comp":60,"vd":133,"ax":{"health":{"compliance":76,"enforcement":68,"coverage":57},"commercial":{"compliance":72,"enforcement":63,"coverage":60},"construction":{"compliance":54,"enforcement":58,"coverage":63},"excavation":{"compliance":50,"enforcement":50,"coverage":44},"distortion":{"compliance":66,"enforcement":47,"coverage":62}}},{"id":"D:الدوبية","ar":"الدوبية","en":"Al Dubiah","p":"C:Riyadh/الرياض","c":[24.6226,46.71197],"pop":100017,"comp":60,"vd":25,"ax":{"health":{"compliance":63,"enforcement":57,"coverage":59},"commercial":{"compliance":69,"enforcement":74,"coverage":55},"construction":{"compliance":63,"enforcement":51,"coverage":53},"excavation":{"compliance":76,"enforcement":63,"coverage":57},"distortion":{"compliance":52,"enforcement":46,"coverage":49}}},{"id":"D:معكال","ar":"معكال","en":"Makal","p":"C:Riyadh/الرياض","c":[24.62357,46.71417],"pop":71912,"comp":70,"vd":95,"ax":{"health":{"compliance":79,"enforcement":76,"coverage":68},"commercial":{"compliance":73,"enforcement":69,"coverage":68},"construction":{"compliance":69,"enforcement":70,"coverage":72},"excavation":{"compliance":78,"enforcement":60,"coverage":62},"distortion":{"compliance":68,"enforcement":69,"coverage":57}}},{"id":"D:جبرة","ar":"جبرة","en":"Jabarah","p":"C:Riyadh/الرياض","c":[24.62503,46.71838],"pop":52856,"comp":69,"vd":32,"ax":{"health":{"compliance":72,"enforcement":70,"coverage":66},"commercial":{"compliance":88,"enforcement":79,"coverage":72},"construction":{"compliance":63,"enforcement":60,"coverage":56},"excavation":{"compliance":62,"enforcement":57,"coverage":57},"distortion":{"compliance":78,"enforcement":69,"coverage":79}}},{"id":"D:القرى","ar":"القرى","en":"Al Qara","p":"C:Riyadh/الرياض","c":[24.62879,46.71605],"pop":27711,"comp":68,"vd":79,"ax":{"health":{"compliance":76,"enforcement":65,"coverage":67},"commercial":{"compliance":77,"enforcement":62,"coverage":68},"construction":{"compliance":71,"enforcement":54,"coverage":69},"excavation":{"compliance":71,"enforcement":56,"coverage":67},"distortion":{"compliance":77,"enforcement":62,"coverage":71}}},{"id":"D:المرقب","ar":"المرقب","en":"Al Maraqab","p":"C:Riyadh/الرياض","c":[24.63439,46.72168],"pop":33734,"comp":61,"vd":122,"ax":{"health":{"compliance":79,"enforcement":74,"coverage":72},"commercial":{"compliance":71,"enforcement":58,"coverage":53},"construction":{"compliance":48,"enforcement":46,"coverage":64},"excavation":{"compliance":64,"enforcement":53,"coverage":63},"distortion":{"compliance":56,"enforcement":50,"coverage":64}}},{"id":"D:الفوطة","ar":"الفوطة","en":"Al Futah","p":"C:Riyadh/الرياض","c":[24.64138,46.71011],"pop":33728,"comp":69,"vd":55,"ax":{"health":{"compliance":84,"enforcement":61,"coverage":77},"commercial":{"compliance":72,"enforcement":70,"coverage":61},"construction":{"compliance":73,"enforcement":58,"coverage":56},"excavation":{"compliance":63,"enforcement":63,"coverage":62},"distortion":{"compliance":78,"enforcement":70,"coverage":69}}},{"id":"D:ام سليم","ar":"ام سليم","en":"Am Salim","p":"C:Riyadh/الرياض","c":[24.63402,46.69844],"pop":67513,"comp":64,"vd":92,"ax":{"health":{"compliance":77,"enforcement":81,"coverage":83},"commercial":{"compliance":68,"enforcement":57,"coverage":72},"construction":{"compliance":69,"enforcement":64,"coverage":58},"excavation":{"compliance":62,"enforcement":51,"coverage":56},"distortion":{"compliance":68,"enforcement":45,"coverage":54}}},{"id":"D:الصحافة","ar":"الصحافة","en":"Al Sahafah","p":"C:Riyadh/الرياض","c":[24.78718,46.64043],"pop":70139,"comp":76,"vd":7,"ax":{"health":{"compliance":94,"enforcement":74,"coverage":84},"commercial":{"compliance":84,"enforcement":78,"coverage":74},"construction":{"compliance":71,"enforcement":66,"coverage":65},"excavation":{"compliance":71,"enforcement":64,"coverage":69},"distortion":{"compliance":89,"enforcement":82,"coverage":72}}},{"id":"D:الرائد","ar":"الرائد","en":"Al Raiad","p":"C:Riyadh/الرياض","c":[24.7096,46.64039],"pop":87624,"comp":70,"vd":56,"ax":{"health":{"compliance":81,"enforcement":61,"coverage":72},"commercial":{"compliance":73,"enforcement":72,"coverage":66},"construction":{"compliance":70,"enforcement":69,"coverage":71},"excavation":{"compliance":76,"enforcement":53,"coverage":68},"distortion":{"compliance":74,"enforcement":68,"coverage":67}}},{"id":"D:العريجاء الغربي","ar":"العريجاء الغربي","en":"Al Arija al-Gharabi","p":"C:Riyadh/الرياض","c":[24.59609,46.59874],"pop":42997,"comp":59,"vd":33,"ax":{"health":{"compliance":76,"enforcement":51,"coverage":55},"commercial":{"compliance":60,"enforcement":50,"coverage":50},"construction":{"compliance":66,"enforcement":54,"coverage":57},"excavation":{"compliance":67,"enforcement":51,"coverage":53},"distortion":{"compliance":59,"enforcement":65,"coverage":58}}},{"id":"D:العريجاء","ar":"العريجاء","en":"Al Arija","p":"C:Riyadh/الرياض","c":[24.62719,46.65754],"pop":96153,"comp":65,"vd":110,"ax":{"health":{"compliance":83,"enforcement":65,"coverage":63},"commercial":{"compliance":75,"enforcement":67,"coverage":68},"construction":{"compliance":78,"enforcement":60,"coverage":57},"excavation":{"compliance":57,"enforcement":41,"coverage":53},"distortion":{"compliance":79,"enforcement":58,"coverage":64}}},{"id":"D:العريجاء الوسطى","ar":"العريجاء الوسطى","en":"Al Arija al-Usata","p":"C:Riyadh/الرياض","c":[24.60561,46.6322],"pop":95802,"comp":63,"vd":87,"ax":{"health":{"compliance":70,"enforcement":65,"coverage":58},"commercial":{"compliance":67,"enforcement":60,"coverage":60},"construction":{"compliance":67,"enforcement":58,"coverage":53},"excavation":{"compliance":70,"enforcement":65,"coverage":63},"distortion":{"compliance":64,"enforcement":59,"coverage":56}}},{"id":"D:الحمراء","ar":"الحمراء","en":"Al Hamara","p":"C:Riyadh/الرياض","c":[24.76799,46.7461],"pop":56324,"comp":77,"vd":77,"ax":{"health":{"compliance":90,"enforcement":87,"coverage":88},"commercial":{"compliance":87,"enforcement":60,"coverage":79},"construction":{"compliance":76,"enforcement":70,"coverage":62},"excavation":{"compliance":76,"enforcement":70,"coverage":69},"distortion":{"compliance":79,"enforcement":75,"coverage":75}}},{"id":"D:الدار البيضاء","ar":"الدار البيضاء","en":"Al Dar al-Bida","p":"C:Riyadh/الرياض","c":[24.56449,46.78992],"pop":119380,"comp":58,"vd":87,"ax":{"health":{"compliance":70,"enforcement":50,"coverage":49},"commercial":{"compliance":75,"enforcement":69,"coverage":60},"construction":{"compliance":58,"enforcement":50,"coverage":54},"excavation":{"compliance":59,"enforcement":41,"coverage":64},"distortion":{"compliance":63,"enforcement":54,"coverage":46}}},{"id":"D:البطيحا","ar":"البطيحا","en":"Al Batiha","p":"C:Riyadh/الرياض","c":[24.62153,46.72011],"pop":39117,"comp":66,"vd":73,"ax":{"health":{"compliance":64,"enforcement":63,"coverage":60},"commercial":{"compliance":76,"enforcement":75,"coverage":70},"construction":{"compliance":68,"enforcement":60,"coverage":53},"excavation":{"compliance":69,"enforcement":51,"coverage":61},"distortion":{"compliance":69,"enforcement":70,"coverage":73}}},{"id":"D:الزهراء","ar":"الزهراء","en":"Al Zahara","p":"C:Riyadh/الرياض","c":[24.69015,46.72829],"pop":86813,"comp":74,"vd":21,"ax":{"health":{"compliance":88,"enforcement":74,"coverage":77},"commercial":{"compliance":73,"enforcement":70,"coverage":68},"construction":{"compliance":72,"enforcement":69,"coverage":69},"excavation":{"compliance":81,"enforcement":72,"coverage":72},"distortion":{"compliance":76,"enforcement":68,"coverage":72}}},{"id":"D:الفيحاء","ar":"الفيحاء","en":"Al Fiha","p":"C:Riyadh/الرياض","c":[24.68184,46.81151],"pop":12005,"comp":59,"vd":94,"ax":{"health":{"compliance":76,"enforcement":58,"coverage":56},"commercial":{"compliance":62,"enforcement":67,"coverage":74},"construction":{"compliance":60,"enforcement":51,"coverage":50},"excavation":{"compliance":53,"enforcement":49,"coverage":44},"distortion":{"compliance":68,"enforcement":58,"coverage":53}}},{"id":"D:المؤتمرات","ar":"المؤتمرات","en":"Al Mauatamarat","p":"C:Riyadh/الرياض","c":[24.67181,46.68663],"pop":69617,"comp":64,"vd":115,"ax":{"health":{"compliance":78,"enforcement":73,"coverage":69},"commercial":{"compliance":67,"enforcement":72,"coverage":57},"construction":{"compliance":57,"enforcement":46,"coverage":68},"excavation":{"compliance":73,"enforcement":52,"coverage":62},"distortion":{"compliance":72,"enforcement":49,"coverage":56}}},{"id":"D:الوسيطاء","ar":"الوسيطاء","en":"Al Usita","p":"C:Riyadh/الرياض","c":[24.62364,46.71634],"pop":81357,"comp":68,"vd":98,"ax":{"health":{"compliance":73,"enforcement":65,"coverage":58},"commercial":{"compliance":72,"enforcement":80,"coverage":66},"construction":{"compliance":73,"enforcement":67,"coverage":64},"excavation":{"compliance":67,"enforcement":69,"coverage":56},"distortion":{"compliance":81,"enforcement":54,"coverage":61}}},{"id":"D:الجنادرية","ar":"الجنادرية","en":"Al Janadariah","p":"C:Riyadh/الرياض","c":[24.86849,46.90538],"pop":109576,"comp":70,"vd":14,"ax":{"health":{"compliance":74,"enforcement":83,"coverage":71},"commercial":{"compliance":92,"enforcement":68,"coverage":85},"construction":{"compliance":81,"enforcement":53,"coverage":56},"excavation":{"compliance":63,"enforcement":58,"coverage":56},"distortion":{"compliance":75,"enforcement":67,"coverage":60}}},{"id":"D:اشبيلية","ar":"اشبيلية","en":"Ashabiliah","p":"C:Riyadh/الرياض","c":[24.79398,46.79322],"pop":23937,"comp":71,"vd":99,"ax":{"health":{"compliance":87,"enforcement":79,"coverage":89},"commercial":{"compliance":79,"enforcement":65,"coverage":59},"construction":{"compliance":69,"enforcement":68,"coverage":60},"excavation":{"compliance":76,"enforcement":70,"coverage":59},"distortion":{"compliance":77,"enforcement":56,"coverage":66}}},{"id":"D:المعيزلة","ar":"المعيزلة","en":"Al Maizalah","p":"C:Riyadh/الرياض","c":[24.79353,46.83979],"pop":116878,"comp":77,"vd":54,"ax":{"health":{"compliance":91,"enforcement":74,"coverage":84},"commercial":{"compliance":77,"enforcement":63,"coverage":71},"construction":{"compliance":92,"enforcement":81,"coverage":80},"excavation":{"compliance":69,"enforcement":60,"coverage":76},"distortion":{"compliance":86,"enforcement":66,"coverage":74}}},{"id":"D:اليرموك","ar":"اليرموك","en":"Al Iramuk","p":"C:Riyadh/الرياض","c":[24.80846,46.78348],"pop":18144,"comp":66,"vd":57,"ax":{"health":{"compliance":82,"enforcement":72,"coverage":68},"commercial":{"compliance":77,"enforcement":59,"coverage":63},"construction":{"compliance":65,"enforcement":70,"coverage":65},"excavation":{"compliance":64,"enforcement":58,"coverage":52},"distortion":{"compliance":75,"enforcement":49,"coverage":51}}},{"id":"D:المونسية","ar":"المونسية","en":"Al Munasiah","p":"C:Riyadh/الرياض","c":[24.83144,46.76776],"pop":43182,"comp":77,"vd":37,"ax":{"health":{"compliance":92,"enforcement":75,"coverage":75},"commercial":{"compliance":99,"enforcement":85,"coverage":85},"construction":{"compliance":83,"enforcement":62,"coverage":65},"excavation":{"compliance":62,"enforcement":73,"coverage":70},"distortion":{"compliance":78,"enforcement":58,"coverage":78}}},{"id":"D:الخزامى","ar":"الخزامى","en":"Al Khazama","p":"C:Riyadh/الرياض","c":[24.70904,46.6076],"pop":89849,"comp":59,"vd":69,"ax":{"health":{"compliance":76,"enforcement":65,"coverage":69},"commercial":{"compliance":61,"enforcement":57,"coverage":58},"construction":{"compliance":52,"enforcement":51,"coverage":59},"excavation":{"compliance":56,"enforcement":49,"coverage":53},"distortion":{"compliance":61,"enforcement":59,"coverage":69}}},{"id":"D:عرقة","ar":"عرقة","en":"Araqah","p":"C:Riyadh/الرياض","c":[24.6877,46.58618],"pop":16586,"comp":60,"vd":107,"ax":{"health":{"compliance":61,"enforcement":71,"coverage":62},"commercial":{"compliance":71,"enforcement":48,"coverage":67},"construction":{"compliance":56,"enforcement":64,"coverage":65},"excavation":{"compliance":68,"enforcement":57,"coverage":49},"distortion":{"compliance":56,"enforcement":53,"coverage":58}}},{"id":"D:ظهرة لبن","ar":"ظهرة لبن","en":"Zaharah Laban","p":"C:Riyadh/الرياض","c":[24.63155,46.5534],"pop":88484,"comp":73,"vd":42,"ax":{"health":{"compliance":89,"enforcement":78,"coverage":87},"commercial":{"compliance":71,"enforcement":65,"coverage":70},"construction":{"compliance":75,"enforcement":63,"coverage":62},"excavation":{"compliance":70,"enforcement":61,"coverage":72},"distortion":{"compliance":80,"enforcement":71,"coverage":72}}},{"id":"D:حطين","ar":"حطين","en":"Hatin","p":"C:Riyadh/الرياض","c":[24.76418,46.60069],"pop":21988,"comp":65,"vd":111,"ax":{"health":{"compliance":71,"enforcement":68,"coverage":59},"commercial":{"compliance":81,"enforcement":61,"coverage":79},"construction":{"compliance":61,"enforcement":51,"coverage":45},"excavation":{"compliance":61,"enforcement":57,"coverage":68},"distortion":{"compliance":79,"enforcement":61,"coverage":71}}},{"id":"D:الملقا","ar":"الملقا","en":"Al Malaqa","p":"C:Riyadh/الرياض","c":[24.80637,46.60126],"pop":84629,"comp":73,"vd":41,"ax":{"health":{"compliance":79,"enforcement":65,"coverage":81},"commercial":{"compliance":85,"enforcement":72,"coverage":80},"construction":{"compliance":76,"enforcement":62,"coverage":73},"excavation":{"compliance":68,"enforcement":70,"coverage":66},"distortion":{"compliance":73,"enforcement":68,"coverage":79}}},{"id":"D:القيروان","ar":"القيروان","en":"Al Qiruan","p":"C:Riyadh/الرياض","c":[24.88378,46.55999],"pop":97061,"comp":67,"vd":39,"ax":{"health":{"compliance":87,"enforcement":70,"coverage":68},"commercial":{"compliance":79,"enforcement":64,"coverage":74},"construction":{"compliance":64,"enforcement":70,"coverage":64},"excavation":{"compliance":62,"enforcement":58,"coverage":66},"distortion":{"compliance":65,"enforcement":60,"coverage":50}}},{"id":"D:الياسمين","ar":"الياسمين","en":"Al Iasamin","p":"C:Riyadh/الرياض","c":[24.82285,46.63974],"pop":25292,"comp":77,"vd":59,"ax":{"health":{"compliance":84,"enforcement":78,"coverage":65},"commercial":{"compliance":73,"enforcement":80,"coverage":82},"construction":{"compliance":82,"enforcement":78,"coverage":68},"excavation":{"compliance":72,"enforcement":70,"coverage":80},"distortion":{"compliance":86,"enforcement":79,"coverage":79}}},{"id":"D:العارض","ar":"العارض","en":"Al Arad","p":"C:Riyadh/الرياض","c":[24.89656,46.60247],"pop":73055,"comp":66,"vd":42,"ax":{"health":{"compliance":80,"enforcement":59,"coverage":65},"commercial":{"compliance":73,"enforcement":65,"coverage":71},"construction":{"compliance":60,"enforcement":44,"coverage":59},"excavation":{"compliance":72,"enforcement":66,"coverage":62},"distortion":{"compliance":76,"enforcement":70,"coverage":58}}},{"id":"D:مطار الملك خالد","ar":"مطار الملك خالد","en":"Matar al-Malak Khalad","p":"C:Riyadh/الرياض","c":[24.93947,46.66078],"pop":8353,"comp":76,"vd":30,"ax":{"health":{"compliance":80,"enforcement":81,"coverage":87},"commercial":{"compliance":92,"enforcement":75,"coverage":80},"construction":{"compliance":81,"enforcement":75,"coverage":78},"excavation":{"compliance":70,"enforcement":67,"coverage":59},"distortion":{"compliance":74,"enforcement":71,"coverage":75}}},{"id":"D:النرجس","ar":"النرجس","en":"Al Narajas","p":"C:Riyadh/الرياض","c":[24.89468,46.64103],"pop":49977,"comp":63,"vd":34,"ax":{"health":{"compliance":78,"enforcement":53,"coverage":59},"commercial":{"compliance":76,"enforcement":63,"coverage":60},"construction":{"compliance":59,"enforcement":58,"coverage":58},"excavation":{"compliance":59,"enforcement":60,"coverage":62},"distortion":{"compliance":65,"enforcement":67,"coverage":70}}},{"id":"D:جامعة الامام محمد بن سعود الاسلامية","ar":"جامعة الامام محمد بن سعود الاسلامية","en":"Jamah al-Amam Mahamad Ban Saud al-Asalamiah","p":"C:Riyadh/الرياض","c":[24.8128,46.70228],"pop":81223,"comp":67,"vd":12,"ax":{"health":{"compliance":81,"enforcement":66,"coverage":59},"commercial":{"compliance":76,"enforcement":59,"coverage":68},"construction":{"compliance":76,"enforcement":58,"coverage":54},"excavation":{"compliance":73,"enforcement":62,"coverage":64},"distortion":{"compliance":71,"enforcement":65,"coverage":68}}},{"id":"D:بنبان","ar":"بنبان","en":"Banaban","p":"C:Riyadh/الرياض","c":[24.98532,46.53513],"pop":13754,"comp":65,"vd":34,"ax":{"health":{"compliance":72,"enforcement":66,"coverage":60},"commercial":{"compliance":76,"enforcement":68,"coverage":81},"construction":{"compliance":68,"enforcement":67,"coverage":62},"excavation":{"compliance":55,"enforcement":49,"coverage":56},"distortion":{"compliance":65,"enforcement":56,"coverage":68}}},{"id":"D:الرمال","ar":"الرمال","en":"Al Ramal","p":"C:Riyadh/الرياض","c":[24.96345,46.76739],"pop":84573,"comp":68,"vd":90,"ax":{"health":{"compliance":87,"enforcement":68,"coverage":75},"commercial":{"compliance":65,"enforcement":64,"coverage":71},"construction":{"compliance":77,"enforcement":64,"coverage":55},"excavation":{"compliance":67,"enforcement":60,"coverage":56},"distortion":{"compliance":67,"enforcement":68,"coverage":60}}},{"id":"D:غرناطة","ar":"غرناطة","en":"Gharanatah","p":"C:Riyadh/الرياض","c":[24.79569,46.75329],"pop":8870,"comp":72,"vd":99,"ax":{"health":{"compliance":80,"enforcement":61,"coverage":69},"commercial":{"compliance":86,"enforcement":84,"coverage":83},"construction":{"compliance":84,"enforcement":56,"coverage":75},"excavation":{"compliance":64,"enforcement":69,"coverage":60},"distortion":{"compliance":76,"enforcement":61,"coverage":66}}},{"id":"D:الدحو","ar":"الدحو","en":"Al Dahu","p":"C:Riyadh/الرياض","c":[24.62895,46.71378],"pop":67848,"comp":61,"vd":113,"ax":{"health":{"compliance":66,"enforcement":74,"coverage":59},"commercial":{"compliance":69,"enforcement":54,"coverage":59},"construction":{"compliance":68,"enforcement":59,"coverage":54},"excavation":{"compliance":60,"enforcement":56,"coverage":64},"distortion":{"compliance":64,"enforcement":45,"coverage":68}}},{"id":"D:العماجية","ar":"العماجية","en":"Al Amajiah","p":"C:Riyadh/الرياض","c":[24.444,46.97863],"pop":30749,"comp":51,"vd":87,"ax":{"health":{"compliance":66,"enforcement":52,"coverage":54},"commercial":{"compliance":61,"enforcement":55,"coverage":50},"construction":{"compliance":54,"enforcement":34,"coverage":43},"excavation":{"compliance":56,"enforcement":52,"coverage":38},"distortion":{"compliance":55,"enforcement":37,"coverage":49}}},{"id":"D:هيت","ar":"هيت","en":"Hit","p":"C:Riyadh/الرياض","c":[24.47913,46.98092],"pop":52398,"comp":53,"vd":142,"ax":{"health":{"compliance":65,"enforcement":48,"coverage":62},"commercial":{"compliance":64,"enforcement":41,"coverage":51},"construction":{"compliance":58,"enforcement":56,"coverage":41},"excavation":{"compliance":62,"enforcement":51,"coverage":56},"distortion":{"compliance":46,"enforcement":38,"coverage":51}}},{"id":"D:الحائر","ar":"الحائر","en":"Al Haiar","p":"C:Riyadh/الرياض","c":[24.4179,46.88802],"pop":39751,"comp":43,"vd":95,"ax":{"health":{"compliance":60,"enforcement":41,"coverage":54},"commercial":{"compliance":42,"enforcement":38,"coverage":50},"construction":{"compliance":48,"enforcement":40,"coverage":48},"excavation":{"compliance":35,"enforcement":33,"coverage":42},"distortion":{"compliance":38,"enforcement":39,"coverage":39}}},{"id":"D:ام الشعال","ar":"ام الشعال","en":"Am al-Shal","p":"C:Riyadh/الرياض","c":[24.36508,46.96072],"pop":31735,"comp":65,"vd":56,"ax":{"health":{"compliance":74,"enforcement":75,"coverage":66},"commercial":{"compliance":57,"enforcement":54,"coverage":56},"construction":{"compliance":72,"enforcement":64,"coverage":58},"excavation":{"compliance":65,"enforcement":58,"coverage":55},"distortion":{"compliance":72,"enforcement":67,"coverage":69}}},{"id":"D:الغنامية","ar":"الغنامية","en":"Al Ghanamiah","p":"C:Riyadh/الرياض","c":[24.47723,46.81352],"pop":10847,"comp":54,"vd":119,"ax":{"health":{"compliance":64,"enforcement":53,"coverage":62},"commercial":{"compliance":77,"enforcement":62,"coverage":55},"construction":{"compliance":46,"enforcement":46,"coverage":43},"excavation":{"compliance":47,"enforcement":47,"coverage":40},"distortion":{"compliance":61,"enforcement":44,"coverage":55}}},{"id":"D:عريض","ar":"عريض","en":"Arid","p":"C:Riyadh/الرياض","c":[24.44075,46.71629],"pop":118634,"comp":52,"vd":96,"ax":{"health":{"compliance":71,"enforcement":46,"coverage":60},"commercial":{"compliance":61,"enforcement":52,"coverage":48},"construction":{"compliance":60,"enforcement":49,"coverage":47},"excavation":{"compliance":50,"enforcement":37,"coverage":32},"distortion":{"compliance":62,"enforcement":42,"coverage":46}}},{"id":"D:بدر","ar":"بدر","en":"Badar","p":"C:Riyadh/الرياض","c":[24.54091,46.72181],"pop":103846,"comp":71,"vd":22,"ax":{"health":{"compliance":86,"enforcement":85,"coverage":68},"commercial":{"compliance":87,"enforcement":78,"coverage":71},"construction":{"compliance":68,"enforcement":65,"coverage":60},"excavation":{"compliance":69,"enforcement":65,"coverage":55},"distortion":{"compliance":73,"enforcement":59,"coverage":52}}},{"id":"D:المهدية","ar":"المهدية","en":"Al Mahadiah","p":"C:Riyadh/الرياض","c":[24.64769,46.50302],"pop":83569,"comp":61,"vd":67,"ax":{"health":{"compliance":74,"enforcement":64,"coverage":77},"commercial":{"compliance":67,"enforcement":62,"coverage":60},"construction":{"compliance":64,"enforcement":56,"coverage":58},"excavation":{"compliance":58,"enforcement":57,"coverage":60},"distortion":{"compliance":54,"enforcement":49,"coverage":60}}},{"id":"D:جامعة الملك سعود","ar":"جامعة الملك سعود","en":"Jamah al-Malak Saud","p":"C:Riyadh/الرياض","c":[24.7257,46.62388],"pop":81260,"comp":72,"vd":86,"ax":{"health":{"compliance":70,"enforcement":69,"coverage":80},"commercial":{"compliance":86,"enforcement":68,"coverage":73},"construction":{"compliance":84,"enforcement":60,"coverage":77},"excavation":{"compliance":78,"enforcement":57,"coverage":63},"distortion":{"compliance":77,"enforcement":60,"coverage":73}}},{"id":"D:النسيم الغربي","ar":"النسيم الغربي","en":"Al Nasim al-Gharabi","p":"C:Riyadh/الرياض","c":[24.72566,46.82399],"pop":116139,"comp":59,"vd":115,"ax":{"health":{"compliance":79,"enforcement":57,"coverage":67},"commercial":{"compliance":61,"enforcement":61,"coverage":65},"construction":{"compliance":61,"enforcement":62,"coverage":50},"excavation":{"compliance":65,"enforcement":48,"coverage":42},"distortion":{"compliance":53,"enforcement":51,"coverage":55}}},{"id":"D:المشاعل","ar":"المشاعل","en":"Al Mashal","p":"C:Riyadh/الرياض","c":[24.62366,46.87646],"pop":66126,"comp":60,"vd":35,"ax":{"health":{"compliance":71,"enforcement":53,"coverage":71},"commercial":{"compliance":62,"enforcement":51,"coverage":61},"construction":{"compliance":59,"enforcement":46,"coverage":54},"excavation":{"compliance":64,"enforcement":56,"coverage":63},"distortion":{"compliance":70,"enforcement":56,"coverage":58}}},{"id":"D:الندوة","ar":"الندوة","en":"Al Naduah","p":"C:Riyadh/الرياض","c":[24.79421,46.87544],"pop":18775,"comp":68,"vd":36,"ax":{"health":{"compliance":80,"enforcement":66,"coverage":75},"commercial":{"compliance":84,"enforcement":71,"coverage":77},"construction":{"compliance":74,"enforcement":54,"coverage":68},"excavation":{"compliance":55,"enforcement":54,"coverage":60},"distortion":{"compliance":67,"enforcement":58,"coverage":67}}},{"id":"D:الرابية","ar":"الرابية","en":"Al Rabiah","p":"C:Riyadh/الرياض","c":[24.96909,46.94941],"pop":29742,"comp":62,"vd":126,"ax":{"health":{"compliance":73,"enforcement":62,"coverage":57},"commercial":{"compliance":72,"enforcement":63,"coverage":62},"construction":{"compliance":66,"enforcement":61,"coverage":55},"excavation":{"compliance":58,"enforcement":58,"coverage":57},"distortion":{"compliance":74,"enforcement":46,"coverage":47}}},{"id":"D:وادي لبن","ar":"وادي لبن","en":"Uadi Laban","p":"C:Riyadh/الرياض","c":[24.58088,46.4846],"pop":69825,"comp":51,"vd":99,"ax":{"health":{"compliance":65,"enforcement":55,"coverage":50},"commercial":{"compliance":60,"enforcement":46,"coverage":66},"construction":{"compliance":40,"enforcement":38,"coverage":46},"excavation":{"compliance":38,"enforcement":35,"coverage":35},"distortion":{"compliance":62,"enforcement":60,"coverage":61}}},{"id":"D:السدرة","ar":"السدرة","en":"Al Sadarah","p":"C:Riyadh/الرياض","c":[24.44931,46.88048],"pop":74514,"comp":58,"vd":73,"ax":{"health":{"compliance":80,"enforcement":60,"coverage":64},"commercial":{"compliance":56,"enforcement":48,"coverage":57},"construction":{"compliance":53,"enforcement":47,"coverage":59},"excavation":{"compliance":54,"enforcement":43,"coverage":52},"distortion":{"compliance":70,"enforcement":64,"coverage":59}}},{"id":"D:التضامن","ar":"التضامن","en":"Al Tadaman","p":"C:Riyadh/الرياض","c":[25.14383,47.09899],"pop":96076,"comp":66,"vd":22,"ax":{"health":{"compliance":79,"enforcement":75,"coverage":71},"commercial":{"compliance":80,"enforcement":75,"coverage":72},"construction":{"compliance":70,"enforcement":54,"coverage":49},"excavation":{"compliance":61,"enforcement":56,"coverage":48},"distortion":{"compliance":71,"enforcement":49,"coverage":62}}},{"id":"D:مدينة الملك عبدالله للطاقة","ar":"مدينة الملك عبدالله للطاقة","en":"Madinah al-Malak Abadalalah Lalataqah","p":"C:Riyadh/الرياض","c":[24.56173,46.39967],"pop":41064,"comp":52,"vd":49,"ax":{"health":{"compliance":72,"enforcement":42,"coverage":54},"commercial":{"compliance":55,"enforcement":54,"coverage":41},"construction":{"compliance":62,"enforcement":44,"coverage":46},"excavation":{"compliance":49,"enforcement":57,"coverage":37},"distortion":{"compliance":59,"enforcement":43,"coverage":47}}},{"id":"D:البساتين","ar":"البساتين","en":"Al Basatin","p":"C:Riyadh/الرياض","c":[25.1416,47.19968],"pop":90753,"comp":62,"vd":99,"ax":{"health":{"compliance":71,"enforcement":66,"coverage":60},"commercial":{"compliance":78,"enforcement":67,"coverage":70},"construction":{"compliance":72,"enforcement":64,"coverage":62},"excavation":{"compliance":49,"enforcement":40,"coverage":52},"distortion":{"compliance":68,"enforcement":53,"coverage":54}}},{"id":"D:الرحاب","ar":"الرحاب","en":"Al Rahab","p":"C:Riyadh/الرياض","c":[25.09575,47.2699],"pop":15335,"comp":67,"vd":14,"ax":{"health":{"compliance":82,"enforcement":76,"coverage":86},"commercial":{"compliance":68,"enforcement":52,"coverage":58},"construction":{"compliance":69,"enforcement":54,"coverage":64},"excavation":{"compliance":64,"enforcement":56,"coverage":67},"distortion":{"compliance":78,"enforcement":60,"coverage":65}}},{"id":"D:المجد","ar":"المجد","en":"Al Majad","p":"C:Riyadh/الرياض","c":[25.0657,47.28083],"pop":109604,"comp":59,"vd":104,"ax":{"health":{"compliance":73,"enforcement":49,"coverage":63},"commercial":{"compliance":68,"enforcement":56,"coverage":68},"construction":{"compliance":57,"enforcement":40,"coverage":55},"excavation":{"compliance":70,"enforcement":46,"coverage":46},"distortion":{"compliance":66,"enforcement":62,"coverage":65}}},{"id":"D:الدانة","ar":"الدانة","en":"Al Danah","p":"C:Riyadh/الرياض","c":[25.08614,47.22951],"pop":22820,"comp":75,"vd":57,"ax":{"health":{"compliance":86,"enforcement":83,"coverage":82},"commercial":{"compliance":75,"enforcement":77,"coverage":72},"construction":{"compliance":88,"enforcement":67,"coverage":67},"excavation":{"compliance":82,"enforcement":59,"coverage":64},"distortion":{"compliance":81,"enforcement":71,"coverage":69}}},{"id":"D:الرسالة","ar":"الرسالة","en":"Al Rasalah","p":"C:Riyadh/الرياض","c":[25.05043,47.23896],"pop":48454,"comp":56,"vd":120,"ax":{"health":{"compliance":61,"enforcement":56,"coverage":53},"commercial":{"compliance":63,"enforcement":62,"coverage":63},"construction":{"compliance":66,"enforcement":43,"coverage":48},"excavation":{"compliance":48,"enforcement":32,"coverage":50},"distortion":{"compliance":72,"enforcement":58,"coverage":59}}},{"id":"D:الخير","ar":"الخير","en":"Al Khir","p":"C:Riyadh/الرياض","c":[25.05807,46.40337],"pop":100765,"comp":64,"vd":74,"ax":{"health":{"compliance":72,"enforcement":58,"coverage":68},"commercial":{"compliance":71,"enforcement":64,"coverage":72},"construction":{"compliance":55,"enforcement":55,"coverage":67},"excavation":{"compliance":67,"enforcement":56,"coverage":62},"distortion":{"compliance":63,"enforcement":65,"coverage":66}}},{"id":"D:الفرسان","ar":"الفرسان","en":"Al Farasan","p":"C:Riyadh/الرياض","c":[25.00282,47.1856],"pop":50831,"comp":71,"vd":48,"ax":{"health":{"compliance":82,"enforcement":74,"coverage":76},"commercial":{"compliance":82,"enforcement":70,"coverage":74},"construction":{"compliance":72,"enforcement":58,"coverage":65},"excavation":{"compliance":72,"enforcement":66,"coverage":61},"distortion":{"compliance":75,"enforcement":61,"coverage":79}}},{"id":"D:الشعلة","ar":"الشعلة","en":"Al Shalah","p":"C:Riyadh/الرياض","c":[25.07145,47.14414],"pop":69925,"comp":65,"vd":32,"ax":{"health":{"compliance":75,"enforcement":63,"coverage":76},"commercial":{"compliance":79,"enforcement":69,"coverage":75},"construction":{"compliance":61,"enforcement":60,"coverage":57},"excavation":{"compliance":57,"enforcement":60,"coverage":71},"distortion":{"compliance":60,"enforcement":61,"coverage":54}}},{"id":"D:الراية","ar":"الراية","en":"Al Raiah","p":"C:Riyadh/الرياض","c":[25.04417,47.2018],"pop":15791,"comp":61,"vd":34,"ax":{"health":{"compliance":78,"enforcement":69,"coverage":61},"commercial":{"compliance":74,"enforcement":66,"coverage":69},"construction":{"compliance":49,"enforcement":46,"coverage":56},"excavation":{"compliance":57,"enforcement":47,"coverage":46},"distortion":{"compliance":64,"enforcement":57,"coverage":61}}},{"id":"D:الزهور","ar":"الزهور","en":"Al Zahur","p":"C:Riyadh/الرياض","c":[25.07934,47.19832],"pop":89629,"comp":73,"vd":47,"ax":{"health":{"compliance":79,"enforcement":79,"coverage":84},"commercial":{"compliance":84,"enforcement":75,"coverage":71},"construction":{"compliance":74,"enforcement":74,"coverage":77},"excavation":{"compliance":62,"enforcement":67,"coverage":66},"distortion":{"compliance":70,"enforcement":64,"coverage":67}}},{"id":"D:الزاهر","ar":"الزاهر","en":"Al Zahar","p":"C:Riyadh/الرياض","c":[25.04996,47.06742],"pop":78826,"comp":81,"vd":42,"ax":{"health":{"compliance":92,"enforcement":92,"coverage":86},"commercial":{"compliance":86,"enforcement":86,"coverage":83},"construction":{"compliance":78,"enforcement":78,"coverage":81},"excavation":{"compliance":74,"enforcement":78,"coverage":77},"distortion":{"compliance":78,"enforcement":66,"coverage":78}}},{"id":"D:المرجان","ar":"المرجان","en":"Al Marajan","p":"C:Riyadh/الرياض","c":[24.93341,46.88167],"pop":31707,"comp":63,"vd":50,"ax":{"health":{"compliance":72,"enforcement":72,"coverage":59},"commercial":{"compliance":73,"enforcement":56,"coverage":63},"construction":{"compliance":66,"enforcement":56,"coverage":62},"excavation":{"compliance":60,"enforcement":55,"coverage":43},"distortion":{"compliance":72,"enforcement":61,"coverage":57}}},{"id":"D:البيان","ar":"البيان","en":"Al Bian","p":"C:Riyadh/الرياض","c":[24.86949,46.86096],"pop":46213,"comp":70,"vd":97,"ax":{"health":{"compliance":92,"enforcement":78,"coverage":79},"commercial":{"compliance":80,"enforcement":62,"coverage":73},"construction":{"compliance":69,"enforcement":60,"coverage":74},"excavation":{"compliance":74,"enforcement":51,"coverage":57},"distortion":{"compliance":70,"enforcement":62,"coverage":63}}},{"id":"D:العلا","ar":"العلا","en":"Al Ala","p":"C:Riyadh/الرياض","c":[25.01377,47.1305],"pop":66901,"comp":60,"vd":53,"ax":{"health":{"compliance":60,"enforcement":69,"coverage":57},"commercial":{"compliance":68,"enforcement":66,"coverage":62},"construction":{"compliance":64,"enforcement":56,"coverage":54},"excavation":{"compliance":58,"enforcement":46,"coverage":60},"distortion":{"compliance":71,"enforcement":51,"coverage":57}}},{"id":"D:المشرق","ar":"المشرق","en":"Al Masharaq","p":"C:Riyadh/الرياض","c":[24.98323,47.05025],"pop":59822,"comp":61,"vd":44,"ax":{"health":{"compliance":69,"enforcement":52,"coverage":69},"commercial":{"compliance":73,"enforcement":68,"coverage":68},"construction":{"compliance":54,"enforcement":46,"coverage":49},"excavation":{"compliance":57,"enforcement":46,"coverage":53},"distortion":{"compliance":71,"enforcement":69,"coverage":72}}},{"id":"D:النخبة","ar":"النخبة","en":"Al Nakhabah","p":"C:Riyadh/الرياض","c":[25.02505,47.27032],"pop":58493,"comp":61,"vd":98,"ax":{"health":{"compliance":68,"enforcement":79,"coverage":75},"commercial":{"compliance":73,"enforcement":51,"coverage":59},"construction":{"compliance":63,"enforcement":55,"coverage":62},"excavation":{"compliance":48,"enforcement":44,"coverage":52},"distortion":{"compliance":60,"enforcement":61,"coverage":55}}},{"id":"D:السحاب","ar":"السحاب","en":"Al Sahab","p":"C:Riyadh/الرياض","c":[24.93979,46.9566],"pop":107553,"comp":75,"vd":5,"ax":{"health":{"compliance":90,"enforcement":73,"coverage":81},"commercial":{"compliance":82,"enforcement":72,"coverage":84},"construction":{"compliance":74,"enforcement":75,"coverage":67},"excavation":{"compliance":62,"enforcement":57,"coverage":68},"distortion":{"compliance":82,"enforcement":77,"coverage":71}}},{"id":"D:الوسام","ar":"الوسام","en":"Al Usam","p":"C:Riyadh/الرياض","c":[24.90819,46.89769],"pop":66269,"comp":73,"vd":31,"ax":{"health":{"compliance":83,"enforcement":75,"coverage":79},"commercial":{"compliance":89,"enforcement":78,"coverage":81},"construction":{"compliance":64,"enforcement":60,"coverage":58},"excavation":{"compliance":68,"enforcement":72,"coverage":80},"distortion":{"compliance":78,"enforcement":59,"coverage":72}}}],"vp":[{"ar":"المباني","en":"Buildings","subs":[{"ar":"المباني المهجورة","en":"Abandoned buildings","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"واجهات المباني المتهالكة","en":"Dilapidated façades","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"الكتابة المشوهة للجدران والدهان","en":"Graffiti & defaced paintwork","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"تغطية الشرفات","en":"Enclosed balconies","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"الهناجر المخالفة فوق السطوح","en":"Illegal rooftop structures","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"مجاري وتمديدات التكييف","en":"Exposed A/C ducts & drains","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"أطباق الأقمار الاصطناعية","en":"Satellite dishes","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"مداخن التهوية في المطاعم","en":"Restaurant exhaust flues","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"تكسيات المباني المتهالكة","en":"Deteriorated cladding","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"الأسوار","en":"Boundary walls","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"المظلات والخيام","en":"Canopies & tents","eAr":"الأمانات","eEn":"Municipalities"}],"ent":[{"ar":"الأمانات","en":"Municipalities"}]},{"ar":"الطرق والشوارع","en":"Roads & Streets","subs":[{"ar":"تشجير الأرصفة وممرات المشاة","en":"Sidewalk & footpath landscaping","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"الأرصفة المتهالكة","en":"Damaged sidewalks","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"دهان البردورات","en":"Kerb painting","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"حفر الشوارع","en":"Street excavations & potholes","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"المطبات العشوائية","en":"Unauthorised speed bumps","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"نظافة الأماكن العامة","en":"Public-space cleanliness","eAr":"المركز الوطني لإدارة النفايات","eEn":"National Waste Management Center"},{"ar":"تسرب المياه","en":"Water leaks","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"عدم دهان الشوارع","en":"Missing road markings","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"محولات الكهرباء في الشوارع","en":"Street electrical transformers","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"السيارات التالفة","en":"Abandoned vehicles","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"وقوف السيارات الغير المصرح بها","en":"Unauthorised parking","eAr":"الأمانات","eEn":"Municipalities"}],"ent":[{"ar":"الأمانات","en":"Municipalities"},{"ar":"المركز الوطني لإدارة النفايات","en":"National Waste Management Center"}]},{"ar":"الإنارة والمرافق الخدمية واللوحات","en":"Lighting, Service Facilities & Signs","subs":[{"ar":"اللوحات الإعلانية","en":"Advertising boards","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"اللوحات الإرشادية","en":"Guidance signage","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"اللوحات التحذيرية","en":"Warning signage","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"اللوحات التجارية","en":"Commercial signage","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"أعمدة الإنارة","en":"Street-lighting poles","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"الأعمدة والأسلاك الكهربائية","en":"Power poles & overhead cables","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"أعمدة الاتصالات","en":"Telecom poles","eAr":"هيئة الاتصالات","eEn":"هيئة الاتصالات"}],"ent":[{"ar":"الأمانات","en":"Municipalities"},{"ar":"هيئة الاتصالات","en":"هيئة الاتصالات"}]},{"ar":"البناء تحت الانشاء","en":"Buildings Under Construction","subs":[{"ar":"الحواجز الخرسانية","en":"Concrete barriers","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"مشاريع الخدمات والحفريات","en":"Utility works & excavations","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"تغطية المباني تحت الإنشاء","en":"Site screening of works","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"تسوير المباني تحت الإنشاء","en":"Site hoarding","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"مخلفات البناء","en":"Construction debris","eAr":"المركز الوطني لإدارة النفايات","eEn":"National Waste Management Center"},{"ar":"التشوين","en":"Material stockpiling","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"نقل مواد البناء","en":"Construction material haulage","eAr":"الأمانات","eEn":"Municipalities"}],"ent":[{"ar":"الأمانات","en":"Municipalities"},{"ar":"المركز الوطني لإدارة النفايات","en":"National Waste Management Center"}]},{"ar":"الفراغات والحدائق العامة","en":"Open Spaces & Public Gardens","subs":[{"ar":"الحدائق والملاعب المهجورة","en":"Neglected parks & playgrounds","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"تسوير الأراضي البيضاء","en":"Fencing of vacant land","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"الأحواض الزراعية","en":"Planting beds","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"أثاث الشوارع","en":"Street furniture","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"باعة جائلين","en":"Street vendors","eAr":"الأمانات","eEn":"Municipalities"},{"ar":"الحاويات وتكدس النفايات","en":"Bins & waste accumulation","eAr":"المركز الوطني لإدارة النفايات","eEn":"National Waste Management Center"},{"ar":"دورات المياه العامة","en":"Public restrooms","eAr":"الأمانات","eEn":"Municipalities"}],"ent":[{"ar":"الأمانات","en":"Municipalities"},{"ar":"المركز الوطني لإدارة النفايات","en":"National Waste Management Center"}]}],"axes":[{"key":"health","ar":"الرخص الصحية","short":"صحية","icon":"⚕"},{"key":"commercial","ar":"الرخص التجارية","short":"تجارية","icon":"🏪"},{"key":"construction","ar":"الرخص الإنشائية","short":"إنشائية","icon":"🏗"},{"key":"excavation","ar":"الحفريات","short":"حفريات","icon":"⛏"},{"key":"distortion","ar":"التشوه البصري","short":"تشوه بصري","icon":"👁"}]};
const GEO_REGIONS={"type":"FeatureCollection","features":[{"type":"Feature","properties":{"name":"Qassim","ar":"القصيم"},"geometry":{"type":"Polygon","coordinates":[[[41.237,25.48],[41.394,25.457],[41.434,25.359],[41.632,25.283],[41.702,25.18],[41.818,25.121],[42.028,24.913],[42.123,24.864],[42.13,24.707],[42.433,24.7],[42.564,24.445],[42.786,24.444],[42.837,24.522],[42.903,24.547],[43.067,24.516],[43.121,24.556],[43.209,24.73],[43.195,24.753],[43.094,24.749],[43.159,24.789],[43.115,24.841],[43.219,24.905],[43.181,24.937],[43.103,24.9],[43.125,24.987],[43.143,25.012],[43.264,25.014],[43.454,25.205],[43.504,25.215],[43.607,25.165],[43.689,25.184],[43.73,25.22],[43.734,25.311],[43.97,25.336],[44.054,25.448],[44.374,25.532],[44.457,25.611],[44.717,25.506],[44.794,25.7],[44.644,25.796],[44.506,26.068],[44.388,26.722],[44.415,26.962],[44.462,27.002],[44.708,27.045],[44.896,26.931],[44.875,27.298],[44.744,27.502],[44.478,27.796],[44.164,27.968],[44.083,27.965],[43.964,27.903],[43.961,27.934],[43.911,27.954],[43.928,28.11],[43.732,27.946],[43.703,27.738],[43.716,27.517],[43.509,27.502],[43.475,27.471],[43.415,27.496],[43.383,27.431],[43.286,27.414],[43.265,27.312],[43.334,27.285],[43.338,27.25],[43.214,27.209],[43.216,27.119],[43.117,26.96],[43.011,26.878],[42.939,26.92],[42.89,26.87],[42.711,26.823],[42.713,26.747],[42.618,26.613],[42.457,26.506],[42.405,26.515],[42.36,26.422],[42.338,26.476],[42.278,26.468],[42.162,26.345],[42.202,26.238],[42.16,26.155],[42.071,26.18],[42.032,26.127],[41.948,26.096],[41.911,26.0],[41.923,25.954],[41.826,25.967],[41.818,25.882],[41.727,25.813],[41.678,25.725],[41.438,25.723],[41.353,25.574],[41.237,25.48]]]}},{"type":"Feature","properties":{"name":"Riyadh","ar":"الرياض"},"geometry":{"type":"Polygon","coordinates":[[[41.985,24.19],[41.984,23.768],[42.105,23.68],[42.225,23.273],[42.374,22.971],[42.462,22.927],[42.961,22.887],[43.014,22.836],[42.981,22.614],[43.017,22.552],[43.125,22.517],[43.289,22.557],[43.476,22.519],[43.457,22.31],[43.509,21.956],[43.422,21.8],[43.437,21.612],[43.391,21.362],[43.667,20.976],[43.816,20.859],[44.048,20.585],[44.063,20.497],[43.967,20.336],[43.931,20.101],[44.124,19.845],[44.496,19.526],[44.915,19.293],[45.266,19.254],[46.974,19.392],[47.745,19.531],[48.289,23.516],[48.31,23.884],[48.271,24.068],[48.136,24.277],[47.869,24.52],[47.596,24.687],[47.497,24.782],[47.467,25.076],[47.474,26.069],[47.43,26.266],[47.06,26.403],[46.831,26.627],[46.589,26.608],[46.231,26.82],[45.934,26.85],[45.693,27.058],[45.527,27.085],[45.247,27.228],[45.189,27.283],[45.045,27.628],[44.979,27.673],[44.895,27.58],[44.721,27.525],[44.875,27.298],[44.896,26.931],[44.708,27.045],[44.462,27.002],[44.41,26.937],[44.392,26.614],[44.506,26.068],[44.644,25.796],[44.794,25.7],[44.717,25.506],[44.457,25.611],[44.374,25.532],[44.054,25.448],[43.97,25.336],[43.734,25.311],[43.73,25.22],[43.689,25.184],[43.607,25.165],[43.504,25.215],[43.454,25.205],[43.264,25.014],[43.143,25.012],[43.125,24.987],[43.103,24.9],[43.181,24.937],[43.219,24.905],[43.115,24.841],[43.159,24.789],[43.094,24.749],[43.195,24.753],[43.209,24.73],[43.121,24.556],[43.067,24.516],[42.903,24.547],[42.837,24.522],[42.786,24.444],[42.564,24.445],[42.433,24.7],[42.13,24.707],[42.084,24.528],[41.999,24.415],[42.026,24.319],[41.985,24.19]]]}},{"type":"Feature","properties":{"name":"Tabuk","ar":"تبوك"},"geometry":{"type":"MultiPolygon","coordinates":[[[[34.494,28.001],[34.502,27.945],[34.553,27.912],[34.622,27.922],[34.589,27.947],[34.584,27.957],[34.589,27.969],[34.502,27.983],[34.543,28.01],[34.494,28.001]]],[[[34.571,28.096],[34.61,28.096],[34.624,28.024],[34.648,28.062],[34.669,28.068],[34.649,28.093],[34.709,28.139],[34.755,28.102],[34.737,28.059],[34.77,28.062],[34.754,28.073],[34.756,28.097],[34.813,28.111],[34.796,28.071],[34.851,28.115],[34.864,28.109],[34.849,28.07],[34.998,28.111],[35.033,28.088],[35.013,28.121],[35.222,28.047],[35.165,28.001],[35.267,27.95],[35.36,27.797],[35.429,27.774],[35.486,27.651],[35.529,27.622],[35.535,27.531],[35.592,27.434],[35.741,27.323],[35.807,27.225],[35.8,27.113],[35.848,27.074],[35.916,26.996],[35.969,26.969],[36.033,26.907],[36.098,26.741],[36.145,26.72],[36.247,26.613],[36.464,26.227],[36.496,26.117],[36.574,26.062],[36.651,26.058],[36.706,26.031],[36.709,26.022],[36.705,26.006],[36.711,25.98],[36.695,25.922],[36.644,25.852],[36.672,25.844],[36.746,25.739],[36.752,25.736],[36.754,25.74],[36.772,25.738],[36.801,25.708],[36.8,25.758],[36.821,25.751],[36.875,25.67],[36.939,25.646],[37.0,25.546],[36.999,25.5],[37.077,25.442],[37.111,25.313],[37.239,25.19],[37.267,25.104],[37.244,25.064],[37.286,24.991],[37.249,24.907],[37.266,24.867],[37.223,24.814],[37.155,24.824],[37.176,24.792],[37.177,24.807],[37.23,24.793],[37.221,24.707],[37.294,24.677],[37.319,24.624],[37.337,24.636],[37.385,24.535],[37.437,24.568],[37.502,24.697],[37.557,24.663],[37.786,24.644],[37.85,24.717],[37.799,24.759],[37.919,24.793],[38.03,24.761],[38.049,24.859],[38.028,24.883],[37.971,24.863],[37.878,24.992],[37.863,25.173],[37.784,25.263],[37.796,25.332],[37.725,25.544],[37.847,25.652],[37.844,25.688],[37.544,25.843],[37.521,26.011],[37.324,26.227],[37.38,26.329],[37.207,26.331],[37.229,26.445],[37.115,26.566],[37.142,26.731],[37.007,26.832],[36.931,26.84],[36.955,27.046],[36.909,27.078],[36.834,27.056],[36.76,27.104],[36.738,27.227],[36.767,27.298],[36.977,27.451],[37.121,27.419],[37.271,27.437],[37.315,27.367],[37.419,27.38],[37.673,27.524],[37.798,27.42],[37.858,27.435],[37.923,27.401],[37.931,27.331],[37.888,27.28],[37.909,27.167],[37.98,27.11],[37.995,27.007],[38.101,26.847],[38.36,26.793],[38.652,26.848],[39.37,26.803],[39.568,26.918],[39.733,27.12],[39.786,27.23],[39.887,27.209],[39.898,27.165],[39.978,27.126],[40.011,27.169],[40.011,27.279],[39.925,27.428],[39.908,27.606],[39.832,27.765],[39.748,27.843],[39.415,27.975],[39.368,28.022],[39.456,28.187],[39.734,28.453],[39.789,28.538],[39.78,28.574],[39.313,28.752],[38.967,29.015],[38.581,29.236],[38.488,29.254],[38.223,29.185],[38.204,29.225],[38.251,29.321],[38.397,29.505],[38.205,29.606],[37.922,29.697],[37.604,29.896],[37.502,30.0],[36.785,29.868],[36.449,29.43],[36.073,29.183],[34.957,29.356],[34.941,29.241],[34.91,29.221],[34.847,29.028],[34.834,28.812],[34.775,28.662],[34.805,28.523],[34.676,28.267],[34.659,28.165],[34.633,28.175],[34.571,28.096]]],[[[34.588,28.125],[34.586,28.123],[34.59,28.124],[34.588,28.125]]],[[[34.589,27.962],[34.59,27.96],[34.591,27.961],[34.589,27.962]]],[[[34.59,27.953],[34.59,27.953],[34.59,27.953],[34.59,27.953]]],[[[34.59,27.954],[34.59,27.954],[34.59,27.954],[34.59,27.954]]],[[[34.59,27.964],[34.591,27.964],[34.59,27.964],[34.59,27.964]]],[[[34.59,27.968],[34.591,27.968],[34.591,27.969],[34.59,27.968]]],[[[34.599,28.144],[34.6,28.144],[34.6,28.144],[34.599,28.144]]],[[[34.601,28.144],[34.602,28.144],[34.602,28.144],[34.601,28.144]]],[[[34.614,28.043],[34.614,28.042],[34.614,28.043],[34.614,28.043]]],[[[34.648,28.184],[34.649,28.181],[34.651,28.181],[34.648,28.184]]],[[[34.666,28.05],[34.652,28.049],[34.667,28.045],[34.666,28.05]]],[[[34.691,27.959],[34.669,27.922],[34.683,27.944],[34.696,27.931],[34.691,27.921],[34.702,27.914],[34.704,27.906],[34.707,27.903],[34.74,27.922],[34.691,27.959]]],[[[34.652,28.041],[34.652,28.04],[34.652,28.04],[34.652,28.041]]],[[[34.657,28.033],[34.657,28.032],[34.657,28.032],[34.657,28.033]]],[[[34.661,28.044],[34.66,28.038],[34.661,28.036],[34.663,28.038],[34.661,28.044]]],[[[34.662,28.209],[34.661,28.209],[34.662,28.208],[34.662,28.209]]],[[[34.666,28.026],[34.666,28.025],[34.666,28.026],[34.666,28.026]]],[[[34.673,28.035],[34.666,28.03],[34.668,28.027],[34.673,28.035]]],[[[34.67,28.053],[34.676,28.049],[34.674,28.054],[34.67,28.053]]],[[[34.672,28.024],[34.67,28.021],[34.671,28.021],[34.672,28.024]]],[[[34.671,28.059],[34.67,28.058],[34.671,28.059],[34.671,28.059]]],[[[34.67,28.02],[34.671,28.02],[34.672,28.021],[34.67,28.02]]],[[[34.683,28.043],[34.685,28.042],[34.685,28.047],[34.683,28.043]]],[[[34.699,28.031],[34.703,28.033],[34.702,28.038],[34.699,28.031]]],[[[34.698,27.914],[34.697,27.913],[34.698,27.914],[34.698,27.914]]],[[[34.701,28.055],[34.702,28.051],[34.702,28.055],[34.701,28.055]]],[[[34.702,28.038],[34.702,28.038],[34.702,28.038],[34.702,28.038]]],[[[34.705,28.078],[34.725,28.077],[34.73,28.072],[34.731,28.062],[34.734,28.061],[34.732,28.073],[34.725,28.082],[34.705,28.078]]],[[[34.722,28.052],[34.705,28.041],[34.709,28.04],[34.722,28.052]]],[[[34.71,28.076],[34.711,28.076],[34.711,28.077],[34.71,28.076]]],[[[34.711,28.109],[34.712,28.108],[34.712,28.109],[34.711,28.109]]],[[[34.725,28.058],[34.725,28.055],[34.727,28.057],[34.725,28.058]]],[[[34.727,28.072],[34.727,28.071],[34.728,28.07],[34.727,28.072]]],[[[34.731,28.079],[34.729,28.079],[34.734,28.072],[34.731,28.079]]],[[[34.735,28.09],[34.729,28.085],[34.738,28.078],[34.735,28.09]]],[[[34.729,28.061],[34.729,28.06],[34.73,28.06],[34.729,28.061]]],[[[34.734,28.07],[34.734,28.07],[34.734,28.071],[34.734,28.07]]],[[[34.735,28.077],[34.735,28.076],[34.736,28.076],[34.735,28.077]]],[[[34.737,28.069],[34.736,28.069],[34.737,28.069],[34.737,28.069]]],[[[34.739,28.077],[34.739,28.075],[34.74,28.075],[34.739,28.077]]],[[[34.762,28.454],[34.761,28.453],[34.762,28.454],[34.762,28.454]]],[[[34.765,28.075],[34.765,28.073],[34.766,28.073],[34.765,28.075]]],[[[34.765,28.087],[34.766,28.086],[34.765,28.087],[34.765,28.087]]],[[[34.783,28.061],[34.78,28.057],[34.79,28.063],[34.783,28.061]]],[[[34.794,28.074],[34.794,28.073],[34.795,28.073],[34.794,28.074]]],[[[34.798,28.082],[34.798,28.081],[34.799,28.082],[34.798,28.082]]],[[[34.8,28.086],[34.801,28.085],[34.801,28.086],[34.8,28.086]]],[[[34.858,28.112],[34.858,28.111],[34.858,28.111],[34.858,28.112]]],[[[34.905,27.939],[34.906,27.929],[34.915,27.934],[34.905,27.939]]],[[[35.03,28.071],[35.033,28.049],[35.049,28.052],[35.03,28.071]]],[[[35.035,28.086],[35.035,28.085],[35.035,28.086],[35.035,28.086]]],[[[35.066,27.906],[35.066,27.906],[35.067,27.904],[35.066,27.906]]],[[[35.068,27.913],[35.071,27.897],[35.07,27.914],[35.068,27.913]]],[[[35.082,28.064],[35.088,28.06],[35.092,28.065],[35.082,28.064]]],[[[35.078,28.041],[35.078,28.041],[35.078,28.041],[35.078,28.041]]],[[[35.14,27.787],[35.144,27.771],[35.147,27.771],[35.14,27.787]]],[[[35.165,27.79],[35.167,27.783],[35.182,27.786],[35.165,27.79]]],[[[35.18,27.976],[35.184,27.976],[35.184,27.976],[35.18,27.976]]],[[[35.183,27.97],[35.195,27.946],[35.209,27.937],[35.225,27.938],[35.183,27.97]]],[[[35.187,27.774],[35.188,27.774],[35.188,27.774],[35.187,27.774]]],[[[35.75,27.127],[35.758,27.103],[35.775,27.082],[35.784,27.08],[35.75,27.127]]],[[[35.78,27.079],[35.781,27.078],[35.781,27.079],[35.78,27.079]]],[[[35.865,27.048],[35.865,27.047],[35.866,27.047],[35.865,27.048]]],[[[35.967,26.97],[35.967,26.969],[35.968,26.97],[35.967,26.97]]],[[[36.009,26.915],[36.013,26.894],[36.028,26.903],[36.009,26.915]]],[[[36.042,26.741],[36.042,26.74],[36.043,26.741],[36.042,26.741]]],[[[36.11,26.6],[36.11,26.598],[36.111,26.598],[36.11,26.6]]],[[[36.22,26.64],[36.218,26.64],[36.22,26.639],[36.22,26.64]]],[[[36.376,26.183],[36.379,26.175],[36.385,26.176],[36.376,26.183]]],[[[36.43,26.162],[36.428,26.162],[36.432,26.159],[36.43,26.162]]],[[[36.441,26.157],[36.442,26.156],[36.443,26.156],[36.441,26.157]]],[[[36.446,26.154],[36.446,26.152],[36.447,26.152],[36.446,26.154]]],[[[36.482,25.644],[36.508,25.613],[36.532,25.616],[36.547,25.625],[36.509,25.662],[36.482,25.644]]],[[[36.523,25.678],[36.523,25.671],[36.527,25.672],[36.523,25.678]]],[[[36.545,25.778],[36.541,25.736],[36.551,25.727],[36.545,25.778]]],[[[36.543,25.704],[36.542,25.699],[36.546,25.699],[36.543,25.704]]],[[[36.544,25.805],[36.547,25.793],[36.545,25.805],[36.544,25.805]]],[[[36.556,25.731],[36.577,25.701],[36.591,25.702],[36.575,25.71],[36.563,25.729],[36.582,25.748],[36.556,25.731]]],[[[36.567,25.728],[36.567,25.727],[36.568,25.727],[36.567,25.728]]],[[[36.577,25.718],[36.574,25.716],[36.578,25.718],[36.577,25.718]]],[[[36.579,25.721],[36.579,25.72],[36.58,25.72],[36.579,25.721]]],[[[36.579,25.716],[36.58,25.715],[36.581,25.716],[36.579,25.716]]],[[[36.593,25.702],[36.592,25.701],[36.593,25.702],[36.593,25.702]]],[[[36.598,25.88],[36.597,25.88],[36.598,25.879],[36.598,25.88]]],[[[36.599,25.881],[36.606,25.881],[36.607,25.884],[36.599,25.881]]],[[[36.602,25.704],[36.602,25.698],[36.603,25.699],[36.602,25.704]]],[[[36.607,26.057],[36.607,26.056],[36.607,26.056],[36.607,26.057]]],[[[36.642,25.682],[36.642,25.68],[36.644,25.683],[36.642,25.682]]],[[[36.644,25.718],[36.642,25.715],[36.642,25.713],[36.644,25.718]]],[[[36.643,25.725],[36.644,25.723],[36.644,25.724],[36.643,25.725]]],[[[36.665,25.574],[36.664,25.574],[36.665,25.574],[36.665,25.574]]],[[[36.669,25.57],[36.666,25.565],[36.668,25.564],[36.669,25.57]]],[[[36.68,25.693],[36.681,25.685],[36.683,25.684],[36.68,25.693]]],[[[36.684,25.679],[36.684,25.678],[36.685,25.68],[36.684,25.679]]],[[[36.689,25.746],[36.69,25.745],[36.691,25.747],[36.689,25.746]]],[[[36.693,25.793],[36.692,25.792],[36.692,25.791],[36.693,25.793]]],[[[36.7,25.569],[36.698,25.565],[36.703,25.565],[36.7,25.569]]],[[[36.699,25.681],[36.698,25.681],[36.699,25.68],[36.699,25.681]]],[[[36.701,26.029],[36.7,26.029],[36.701,26.029],[36.701,26.029]]],[[[36.705,26.028],[36.703,26.027],[36.704,26.026],[36.705,26.028]]],[[[36.706,26.024],[36.706,26.023],[36.707,26.023],[36.706,26.024]]],[[[36.709,25.563],[36.708,25.562],[36.709,25.562],[36.709,25.563]]],[[[36.71,25.564],[36.709,25.564],[36.71,25.564],[36.71,25.564]]],[[[36.711,25.562],[36.711,25.561],[36.711,25.562],[36.711,25.562]]],[[[36.713,25.563],[36.713,25.562],[36.714,25.563],[36.713,25.563]]],[[[36.715,25.56],[36.715,25.56],[36.715,25.56],[36.715,25.56]]],[[[36.715,25.563],[36.715,25.562],[36.716,25.563],[36.715,25.563]]],[[[36.717,25.765],[36.716,25.761],[36.718,25.761],[36.717,25.765]]],[[[36.717,25.657],[36.716,25.653],[36.72,25.657],[36.717,25.657]]],[[[36.717,25.56],[36.715,25.559],[36.717,25.559],[36.717,25.56]]],[[[36.717,25.563],[36.717,25.562],[36.718,25.562],[36.717,25.563]]],[[[36.718,25.771],[36.719,25.771],[36.719,25.772],[36.718,25.771]]],[[[36.719,25.761],[36.718,25.76],[36.719,25.76],[36.719,25.761]]],[[[36.719,25.56],[36.719,25.559],[36.719,25.559],[36.719,25.56]]],[[[36.72,25.76],[36.72,25.759],[36.72,25.759],[36.72,25.76]]],[[[36.722,25.758],[36.721,25.757],[36.722,25.757],[36.722,25.758]]],[[[36.723,25.558],[36.721,25.558],[36.723,25.558],[36.723,25.558]]],[[[36.727,25.756],[36.725,25.751],[36.732,25.754],[36.727,25.756]]],[[[36.724,25.559],[36.724,25.558],[36.725,25.558],[36.724,25.559]]],[[[36.73,25.559],[36.73,25.559],[36.731,25.559],[36.73,25.559]]],[[[36.731,25.559],[36.73,25.558],[36.731,25.558],[36.731,25.559]]],[[[36.734,25.753],[36.734,25.752],[36.735,25.752],[36.734,25.753]]],[[[36.737,25.723],[36.734,25.719],[36.737,25.717],[36.737,25.723]]],[[[36.746,25.539],[36.743,25.548],[36.744,25.541],[36.746,25.539]]],[[[36.738,25.749],[36.738,25.749],[36.738,25.749],[36.738,25.749]]],[[[36.743,25.679],[36.748,25.676],[36.751,25.681],[36.743,25.679]]],[[[36.759,25.534],[36.745,25.526],[36.752,25.528],[36.759,25.534]]],[[[36.756,25.69],[36.757,25.689],[36.759,25.692],[36.756,25.69]]],[[[36.76,25.666],[36.766,25.663],[36.765,25.665],[36.76,25.666]]],[[[36.774,25.53],[36.771,25.53],[36.776,25.525],[36.774,25.53]]],[[[36.765,25.695],[36.767,25.693],[36.768,25.697],[36.765,25.695]]],[[[36.765,25.513],[36.767,25.512],[36.767,25.514],[36.765,25.513]]],[[[36.766,25.738],[36.765,25.737],[36.766,25.737],[36.766,25.738]]],[[[36.772,25.723],[36.772,25.722],[36.772,25.722],[36.772,25.723]]],[[[36.774,25.699],[36.772,25.697],[36.775,25.699],[36.774,25.699]]],[[[36.779,25.703],[36.779,25.7],[36.781,25.702],[36.779,25.703]]],[[[36.782,25.71],[36.78,25.709],[36.782,25.709],[36.782,25.71]]],[[[36.787,25.72],[36.787,25.717],[36.789,25.717],[36.787,25.72]]],[[[36.788,25.715],[36.787,25.714],[36.788,25.714],[36.788,25.715]]],[[[36.79,25.506],[36.79,25.505],[36.791,25.505],[36.79,25.506]]],[[[36.794,25.692],[36.794,25.691],[36.794,25.692],[36.794,25.692]]],[[[36.794,25.479],[36.794,25.479],[36.795,25.479],[36.794,25.479]]],[[[36.795,25.502],[36.795,25.5],[36.797,25.5],[36.795,25.502]]],[[[36.806,25.468],[36.801,25.465],[36.81,25.462],[36.806,25.468]]],[[[36.802,25.703],[36.802,25.701],[36.803,25.704],[36.802,25.703]]],[[[36.806,25.493],[36.804,25.488],[36.809,25.491],[36.806,25.493]]],[[[36.812,25.701],[36.812,25.699],[36.814,25.702],[36.812,25.701]]],[[[36.817,25.494],[36.817,25.493],[36.818,25.494],[36.817,25.494]]],[[[36.825,25.494],[36.824,25.493],[36.826,25.493],[36.825,25.494]]],[[[36.824,25.725],[36.826,25.725],[36.826,25.725],[36.824,25.725]]],[[[36.825,25.682],[36.826,25.68],[36.827,25.682],[36.825,25.682]]],[[[36.827,25.728],[36.828,25.727],[36.828,25.728],[36.827,25.728]]],[[[36.84,25.571],[36.841,25.534],[36.87,25.556],[36.84,25.571]]],[[[36.829,25.729],[36.829,25.729],[36.829,25.729],[36.829,25.729]]],[[[36.83,25.492],[36.83,25.491],[36.831,25.488],[36.834,25.485],[36.83,25.492]]],[[[36.833,25.724],[36.833,25.723],[36.835,25.725],[36.833,25.724]]],[[[36.844,25.438],[36.845,25.43],[36.851,25.434],[36.844,25.438]]],[[[36.848,25.468],[36.843,25.469],[36.854,25.465],[36.848,25.468]]],[[[36.847,25.42],[36.846,25.419],[36.848,25.419],[36.847,25.42]]],[[[36.848,25.421],[36.88,25.392],[36.897,25.396],[36.88,25.413],[36.848,25.421]]],[[[36.853,25.621],[36.852,25.619],[36.856,25.619],[36.853,25.621]]],[[[36.852,25.541],[36.85,25.54],[36.852,25.541],[36.852,25.541]]],[[[36.852,25.433],[36.852,25.432],[36.852,25.432],[36.852,25.433]]],[[[36.855,25.463],[36.854,25.463],[36.855,25.462],[36.855,25.463]]],[[[36.854,25.432],[36.854,25.432],[36.854,25.432],[36.854,25.432]]],[[[36.861,25.436],[36.861,25.435],[36.862,25.436],[36.861,25.436]]],[[[36.861,25.618],[36.861,25.618],[36.862,25.617],[36.861,25.618]]],[[[36.863,25.432],[36.862,25.431],[36.863,25.431],[36.863,25.432]]],[[[36.865,25.453],[36.865,25.452],[36.866,25.452],[36.865,25.453]]],[[[36.867,25.452],[36.866,25.452],[36.867,25.451],[36.867,25.452]]],[[[36.87,25.45],[36.87,25.449],[36.871,25.449],[36.87,25.45]]],[[[36.874,25.417],[36.873,25.416],[36.875,25.416],[36.874,25.417]]],[[[36.881,25.611],[36.882,25.609],[36.886,25.611],[36.881,25.611]]],[[[36.881,25.452],[36.881,25.451],[36.882,25.451],[36.881,25.452]]],[[[36.885,25.426],[36.885,25.424],[36.886,25.424],[36.885,25.426]]],[[[36.893,25.386],[36.891,25.361],[36.91,25.36],[36.893,25.386]]],[[[36.889,25.389],[36.887,25.387],[36.89,25.388],[36.889,25.389]]],[[[36.888,25.409],[36.886,25.409],[36.888,25.408],[36.888,25.409]]],[[[36.889,25.407],[36.888,25.406],[36.89,25.406],[36.889,25.407]]],[[[36.891,25.407],[36.891,25.406],[36.891,25.406],[36.891,25.407]]],[[[36.892,25.404],[36.891,25.402],[36.892,25.402],[36.892,25.404]]],[[[36.893,25.428],[36.893,25.428],[36.895,25.429],[36.893,25.428]]],[[[36.898,25.394],[36.897,25.394],[36.898,25.394],[36.898,25.394]]],[[[36.902,25.385],[36.902,25.383],[36.902,25.383],[36.902,25.385]]],[[[36.906,25.58],[36.904,25.579],[36.907,25.578],[36.906,25.58]]],[[[36.904,25.381],[36.904,25.381],[36.905,25.381],[36.904,25.381]]],[[[36.91,25.569],[36.919,25.542],[36.923,25.523],[36.934,25.523],[36.91,25.569]]],[[[36.908,25.427],[36.906,25.426],[36.91,25.426],[36.908,25.427]]],[[[36.929,25.594],[36.914,25.585],[36.923,25.578],[36.929,25.594]]],[[[36.91,25.578],[36.91,25.578],[36.909,25.574],[36.91,25.572],[36.91,25.578]]],[[[36.922,25.524],[36.922,25.524],[36.922,25.524],[36.922,25.524]]],[[[36.934,25.408],[36.933,25.407],[36.934,25.408],[36.934,25.408]]],[[[36.941,25.617],[36.942,25.611],[36.945,25.612],[36.941,25.617]]],[[[36.94,25.498],[36.975,25.492],[36.986,25.493],[36.953,25.515],[36.94,25.498]]],[[[36.942,25.567],[36.944,25.566],[36.943,25.567],[36.942,25.567]]],[[[36.947,25.589],[36.944,25.59],[36.947,25.588],[36.947,25.589]]],[[[36.953,25.542],[36.954,25.529],[36.966,25.526],[36.953,25.542]]],[[[36.953,25.593],[36.949,25.587],[36.956,25.589],[36.953,25.593]]],[[[36.959,25.588],[36.959,25.587],[36.96,25.587],[36.959,25.588]]],[[[36.965,25.579],[36.964,25.574],[36.969,25.573],[36.965,25.579]]],[[[36.966,25.459],[36.964,25.459],[36.966,25.459],[36.966,25.459]]],[[[36.964,25.472],[36.964,25.472],[36.964,25.471],[36.964,25.472]]],[[[36.968,25.578],[36.967,25.576],[36.969,25.577],[36.968,25.578]]],[[[36.967,25.472],[36.986,25.463],[36.983,25.434],[37.024,25.43],[37.023,25.446],[37.006,25.445],[36.989,25.473],[36.967,25.472]]],[[[36.976,25.466],[36.974,25.463],[36.976,25.462],[36.976,25.466]]],[[[36.976,25.442],[36.974,25.441],[36.976,25.441],[36.976,25.442]]],[[[36.975,25.444],[36.975,25.443],[36.975,25.443],[36.975,25.444]]],[[[36.977,25.526],[36.976,25.525],[36.978,25.524],[36.977,25.526]]],[[[36.977,25.542],[36.977,25.54],[36.979,25.54],[36.977,25.542]]],[[[36.978,25.427],[36.979,25.425],[36.979,25.427],[36.978,25.427]]],[[[36.977,25.427],[36.977,25.427],[36.977,25.427],[36.977,25.427]]],[[[36.977,25.434],[36.979,25.433],[36.979,25.434],[36.977,25.434]]],[[[36.979,25.508],[36.978,25.507],[36.979,25.507],[36.979,25.508]]],[[[36.98,25.463],[36.979,25.461],[36.981,25.46],[36.98,25.463]]],[[[36.982,25.432],[36.982,25.43],[36.984,25.432],[36.982,25.432]]],[[[36.992,25.472],[36.991,25.472],[36.992,25.471],[36.992,25.472]]],[[[36.994,25.473],[36.993,25.471],[36.995,25.47],[36.994,25.473]]],[[[37.0,25.465],[37.0,25.464],[37.0,25.465],[37.0,25.465]]],[[[37.001,25.47],[37.0,25.469],[37.002,25.467],[37.001,25.47]]],[[[37.003,25.457],[37.0,25.458],[37.002,25.456],[37.003,25.457]]],[[[37.002,25.464],[37.002,25.463],[37.002,25.464],[37.002,25.464]]],[[[37.011,25.424],[37.01,25.422],[37.012,25.423],[37.011,25.424]]],[[[37.013,25.424],[37.013,25.423],[37.014,25.424],[37.013,25.424]]],[[[37.015,25.425],[37.014,25.425],[37.015,25.425],[37.015,25.425]]],[[[37.018,25.474],[37.016,25.472],[37.021,25.472],[37.018,25.474]]],[[[37.014,25.424],[37.015,25.422],[37.015,25.424],[37.014,25.424]]],[[[37.021,25.465],[37.017,25.464],[37.024,25.462],[37.021,25.465]]],[[[37.022,25.455],[37.023,25.45],[37.029,25.456],[37.022,25.455]]],[[[37.028,25.421],[37.029,25.42],[37.029,25.42],[37.028,25.421]]],[[[37.03,25.416],[37.029,25.414],[37.031,25.414],[37.03,25.416]]],[[[37.03,25.42],[37.029,25.42],[37.031,25.419],[37.03,25.42]]],[[[37.036,25.417],[37.035,25.411],[37.04,25.413],[37.036,25.417]]],[[[37.045,24.971],[37.045,24.97],[37.046,24.97],[37.045,24.971]]],[[[37.051,24.977],[37.054,24.971],[37.055,24.974],[37.051,24.977]]],[[[37.05,25.454],[37.049,25.451],[37.05,25.454],[37.05,25.454]]],[[[37.058,25.428],[37.058,25.427],[37.059,25.422],[37.058,25.428]]],[[[37.061,25.416],[37.065,25.408],[37.067,25.411],[37.061,25.416]]],[[[37.063,25.444],[37.063,25.443],[37.065,25.444],[37.063,25.444]]],[[[37.065,25.451],[37.062,25.45],[37.065,25.45],[37.065,25.451]]],[[[37.065,24.958],[37.108,24.947],[37.114,24.958],[37.075,24.987],[37.065,24.958]]],[[[37.071,25.413],[37.071,25.408],[37.072,25.408],[37.071,25.413]]],[[[37.081,25.394],[37.079,25.395],[37.08,25.394],[37.081,25.394]]],[[[37.144,24.988],[37.145,24.987],[37.146,24.987],[37.144,24.988]]],[[[37.145,25.23],[37.142,25.23],[37.144,25.23],[37.145,25.23]]],[[[37.148,25.165],[37.149,25.165],[37.149,25.165],[37.148,25.165]]],[[[37.16,25.161],[37.161,25.158],[37.162,25.164],[37.16,25.161]]],[[[37.176,25.209],[37.171,25.182],[37.175,25.194],[37.176,25.209]]],[[[37.169,25.166],[37.169,25.168],[37.169,25.166],[37.169,25.166]]],[[[37.169,25.216],[37.17,25.21],[37.171,25.21],[37.169,25.216]]],[[[37.177,24.859],[37.177,24.858],[37.178,24.858],[37.177,24.859]]],[[[37.178,24.8],[37.177,24.799],[37.179,24.799],[37.178,24.8]]],[[[37.178,24.944],[37.178,24.937],[37.189,24.942],[37.178,24.944]]],[[[37.178,24.801],[37.178,24.8],[37.179,24.8],[37.178,24.801]]],[[[37.179,24.8],[37.179,24.799],[37.18,24.8],[37.179,24.8]]],[[[37.2,24.801],[37.198,24.775],[37.217,24.792],[37.2,24.801]]],[[[37.206,24.823],[37.207,24.82],[37.208,24.822],[37.206,24.823]]],[[[37.223,24.831],[37.219,24.831],[37.224,24.829],[37.223,24.831]]]]}},{"type":"Feature","properties":{"name":"Madinah","ar":"المدينة المنورة"},"geometry":{"type":"MultiPolygon","coordinates":[[[[36.738,27.227],[36.754,27.115],[36.791,27.076],[36.847,27.056],[36.926,27.077],[36.955,27.046],[36.931,26.84],[37.007,26.832],[37.142,26.731],[37.115,26.566],[37.229,26.445],[37.207,26.331],[37.38,26.329],[37.324,26.227],[37.521,26.011],[37.544,25.843],[37.613,25.787],[37.743,25.758],[37.848,25.679],[37.733,25.568],[37.725,25.524],[37.796,25.332],[37.789,25.249],[37.863,25.173],[37.878,24.992],[37.971,24.863],[38.042,24.876],[38.051,24.788],[38.03,24.761],[37.919,24.793],[37.805,24.763],[37.85,24.717],[37.78,24.643],[37.495,24.694],[37.445,24.579],[37.386,24.534],[37.461,24.437],[37.427,24.369],[37.502,24.286],[37.623,24.246],[37.616,24.294],[37.692,24.301],[37.864,24.151],[37.929,24.146],[37.912,24.197],[37.952,24.21],[37.935,24.166],[37.978,24.175],[37.991,24.157],[37.934,24.145],[38.039,24.07],[38.082,24.077],[38.161,24.019],[38.15,24.001],[38.192,24.001],[38.249,23.932],[38.282,23.942],[38.4,23.81],[38.463,23.781],[38.492,23.662],[38.539,23.633],[38.517,23.624],[38.543,23.54],[38.597,23.531],[38.556,23.563],[38.605,23.571],[38.655,23.422],[38.928,23.448],[38.99,23.356],[39.208,23.162],[39.44,23.176],[39.473,23.057],[39.776,23.144],[39.914,23.152],[39.953,23.028],[39.878,22.819],[40.071,22.716],[40.061,22.528],[40.102,22.5],[40.241,22.499],[40.419,22.632],[40.663,22.574],[40.793,22.753],[41.212,23.087],[41.448,23.197],[41.453,23.259],[41.297,23.338],[41.27,23.396],[41.715,23.629],[41.766,23.729],[41.729,23.882],[41.746,23.944],[41.84,23.972],[41.988,23.957],[41.985,24.19],[42.026,24.319],[41.999,24.415],[42.091,24.543],[42.139,24.836],[41.917,25.042],[41.702,25.18],[41.614,25.296],[41.434,25.359],[41.394,25.457],[41.174,25.49],[41.064,25.568],[40.831,25.562],[40.714,25.417],[40.593,25.406],[40.507,25.437],[40.457,25.383],[40.454,25.291],[40.18,25.327],[40.014,25.384],[39.958,25.525],[39.962,26.15],[39.888,26.264],[39.886,26.398],[39.761,26.598],[39.668,26.667],[39.659,26.731],[39.507,26.757],[39.502,26.858],[39.343,26.801],[38.652,26.848],[38.37,26.793],[38.121,26.832],[38.004,26.988],[37.98,27.11],[37.914,27.154],[37.888,27.28],[37.931,27.331],[37.923,27.401],[37.858,27.435],[37.798,27.42],[37.659,27.527],[37.519,27.425],[37.315,27.367],[37.271,27.437],[37.121,27.419],[36.977,27.451],[36.767,27.298],[36.738,27.227]]],[[[37.639,24.262],[37.638,24.258],[37.64,24.261],[37.639,24.262]]],[[[37.665,24.252],[37.663,24.251],[37.665,24.251],[37.665,24.252]]],[[[37.945,24.207],[37.943,24.204],[37.946,24.205],[37.945,24.207]]],[[[38.183,23.992],[38.183,23.985],[38.184,23.992],[38.183,23.992]]],[[[38.186,23.991],[38.191,23.988],[38.189,23.997],[38.186,23.991]]],[[[38.511,23.638],[38.515,23.626],[38.522,23.631],[38.511,23.638]]],[[[38.577,23.557],[38.576,23.556],[38.577,23.556],[38.577,23.557]]],[[[38.598,23.532],[38.6,23.531],[38.6,23.532],[38.598,23.532]]],[[[38.656,23.422],[38.656,23.42],[38.656,23.42],[38.656,23.422]]]]}},{"type":"Feature","properties":{"name":"Makkah","ar":"مكة المكرمة"},"geometry":{"type":"MultiPolygon","coordinates":[[[[38.665,23.39],[38.662,23.379],[38.667,23.377],[38.665,23.39]]],[[[38.665,23.419],[38.684,23.298],[38.746,23.196],[38.783,23.195],[38.791,23.173],[38.812,23.088],[38.798,23.009],[38.833,22.969],[38.827,22.991],[38.831,22.998],[38.919,22.958],[38.973,22.863],[38.922,22.852],[38.888,22.923],[38.849,22.938],[38.986,22.741],[39.012,22.76],[38.988,22.729],[39.079,22.58],[39.08,22.52],[39.102,22.526],[39.079,22.514],[39.095,22.361],[39.106,22.382],[39.123,22.378],[39.108,22.406],[39.128,22.415],[39.143,22.407],[39.135,22.37],[39.111,22.344],[39.089,22.349],[39.108,22.337],[39.098,22.282],[39.04,22.203],[39.042,22.146],[39.018,22.095],[39.053,22.165],[39.056,22.161],[39.056,22.157],[39.053,22.153],[39.062,22.146],[39.054,22.063],[39.015,22.062],[39.008,21.985],[38.971,21.979],[38.965,21.986],[38.973,22.027],[38.991,22.039],[38.963,22.034],[38.967,22.018],[38.946,22.032],[38.93,22.012],[38.966,21.952],[38.949,21.907],[39.012,21.819],[39.017,21.831],[39.036,21.842],[39.039,21.839],[39.013,21.818],[39.083,21.71],[39.132,21.765],[39.161,21.785],[39.172,21.779],[39.086,21.704],[39.1,21.662],[39.116,21.538],[39.112,21.534],[39.131,21.509],[39.141,21.535],[39.156,21.534],[39.185,21.493],[39.153,21.491],[39.148,21.474],[39.175,21.447],[39.154,21.445],[39.155,21.429],[39.169,21.445],[39.189,21.415],[39.176,21.375],[39.133,21.345],[39.127,21.346],[39.126,21.347],[39.136,21.362],[39.133,21.366],[39.099,21.324],[39.162,21.22],[39.15,21.189],[39.169,21.202],[39.174,21.189],[39.168,21.154],[39.19,21.102],[39.239,21.075],[39.267,21.035],[39.308,20.926],[39.348,20.923],[39.371,20.902],[39.374,20.888],[39.356,20.886],[39.363,20.867],[39.456,20.823],[39.455,20.799],[39.424,20.818],[39.456,20.745],[39.49,20.729],[39.458,20.765],[39.452,20.787],[39.498,20.765],[39.502,20.733],[39.486,20.727],[39.533,20.641],[39.606,20.59],[39.62,20.558],[39.587,20.583],[39.584,20.565],[39.731,20.392],[39.948,20.26],[39.918,20.299],[39.975,20.281],[39.991,20.252],[40.01,20.282],[40.065,20.288],[40.112,20.273],[40.169,20.191],[40.236,20.192],[40.231,20.159],[40.286,20.1],[40.391,20.069],[40.539,19.967],[40.536,19.903],[40.649,19.763],[40.678,19.745],[40.684,19.753],[40.675,19.753],[40.654,19.77],[40.65,19.793],[40.737,19.798],[40.794,19.733],[40.806,19.617],[40.777,19.61],[40.963,19.497],[40.953,19.351],[41.045,19.263],[41.073,19.12],[41.161,19.086],[41.13,18.956],[41.16,18.883],[41.243,18.847],[41.209,18.707],[41.257,18.612],[41.359,18.58],[41.418,18.515],[41.424,18.497],[41.414,18.488],[41.416,18.474],[41.42,18.487],[41.438,18.482],[41.473,18.294],[41.516,18.273],[41.49,18.246],[41.491,18.233],[41.503,18.254],[41.528,18.238],[41.586,18.095],[41.639,18.2],[41.756,18.275],[41.814,18.491],[41.707,18.762],[41.45,18.787],[41.411,18.816],[41.383,18.919],[41.391,19.175],[41.397,19.195],[41.476,19.145],[41.611,19.23],[41.835,19.242],[41.894,19.408],[41.83,19.53],[41.862,19.762],[41.829,19.805],[41.765,19.819],[41.497,19.766],[41.428,19.643],[41.353,19.396],[41.214,19.366],[40.963,19.58],[40.954,19.954],[40.926,19.996],[40.819,20.026],[40.795,20.084],[40.911,20.196],[41.136,20.247],[41.253,20.471],[41.225,20.66],[41.284,20.756],[41.391,20.748],[41.464,20.606],[41.519,20.566],[41.974,20.677],[42.037,20.62],[42.167,20.377],[42.274,20.342],[42.635,20.626],[42.821,20.709],[42.944,20.813],[43.234,20.869],[43.385,20.833],[43.667,20.976],[43.386,21.381],[43.437,21.612],[43.422,21.8],[43.509,21.956],[43.457,22.31],[43.476,22.519],[43.289,22.557],[43.125,22.517],[43.017,22.552],[42.981,22.614],[43.014,22.836],[42.961,22.887],[42.462,22.927],[42.374,22.971],[42.225,23.273],[42.105,23.68],[41.984,23.768],[41.986,23.949],[41.84,23.972],[41.746,23.944],[41.729,23.882],[41.766,23.729],[41.715,23.629],[41.27,23.396],[41.297,23.338],[41.453,23.259],[41.448,23.197],[41.212,23.087],[40.793,22.753],[40.663,22.574],[40.419,22.632],[40.217,22.492],[40.079,22.507],[40.071,22.716],[39.878,22.819],[39.953,23.028],[39.914,23.152],[39.776,23.144],[39.473,23.057],[39.44,23.176],[39.208,23.162],[38.99,23.356],[38.928,23.448],[38.665,23.419]]],[[[38.769,23.173],[38.768,23.171],[38.77,23.17],[38.769,23.173]]],[[[38.787,23.179],[38.775,23.161],[38.784,23.155],[38.787,23.147],[38.787,23.179]]],[[[38.779,23.151],[38.779,23.139],[38.783,23.137],[38.779,23.151]]],[[[38.782,23.153],[38.78,23.15],[38.783,23.147],[38.782,23.153]]],[[[38.796,23.118],[38.796,23.117],[38.796,23.118],[38.796,23.118]]],[[[38.826,22.967],[38.825,22.965],[38.828,22.965],[38.826,22.967]]],[[[38.838,22.967],[38.841,22.958],[38.846,22.959],[38.838,22.967]]],[[[38.839,22.974],[38.845,22.971],[38.849,22.973],[38.839,22.974]]],[[[38.841,22.979],[38.841,22.978],[38.843,22.978],[38.841,22.979]]],[[[38.841,22.969],[38.843,22.963],[38.849,22.959],[38.841,22.969]]],[[[38.851,22.955],[38.847,22.948],[38.862,22.943],[38.851,22.955]]],[[[38.849,22.97],[38.849,22.968],[38.849,22.969],[38.849,22.97]]],[[[38.872,22.951],[38.862,22.952],[38.872,22.949],[38.876,22.943],[38.872,22.951]]],[[[38.865,22.978],[38.854,22.97],[38.858,22.967],[38.865,22.978]]],[[[38.867,22.941],[38.865,22.942],[38.867,22.94],[38.867,22.941]]],[[[38.87,22.946],[38.87,22.946],[38.87,22.946],[38.87,22.946]]],[[[38.88,22.941],[38.88,22.935],[38.883,22.936],[38.88,22.941]]],[[[38.925,22.902],[38.928,22.883],[38.943,22.88],[38.925,22.902]]],[[[38.941,21.962],[38.94,21.956],[38.942,21.956],[38.941,21.962]]],[[[38.945,21.941],[38.944,21.937],[38.947,21.938],[38.945,21.941]]],[[[38.952,21.962],[38.946,21.958],[38.952,21.961],[38.952,21.962]]],[[[38.951,21.958],[38.946,21.955],[38.954,21.958],[38.951,21.958]]],[[[38.952,21.955],[38.947,21.952],[38.953,21.954],[38.952,21.955]]],[[[38.948,21.936],[38.951,21.935],[38.951,21.936],[38.948,21.936]]],[[[38.953,21.952],[38.948,21.948],[38.956,21.952],[38.953,21.952]]],[[[38.954,21.948],[38.949,21.945],[38.955,21.948],[38.954,21.948]]],[[[38.95,21.933],[38.949,21.93],[38.953,21.933],[38.95,21.933]]],[[[38.952,22.06],[38.96,22.062],[38.957,22.068],[38.952,22.06]]],[[[38.953,21.937],[38.954,21.935],[38.956,21.936],[38.953,21.937]]],[[[38.958,21.963],[38.954,21.961],[38.959,21.963],[38.958,21.963]]],[[[38.955,21.934],[38.955,21.932],[38.957,21.933],[38.955,21.934]]],[[[38.96,21.957],[38.956,21.954],[38.961,21.956],[38.96,21.957]]],[[[38.959,21.96],[38.954,21.957],[38.96,21.959],[38.959,21.96]]],[[[38.962,21.951],[38.958,21.948],[38.963,21.95],[38.962,21.951]]],[[[38.958,22.037],[38.96,22.037],[38.961,22.041],[38.958,22.037]]],[[[38.961,21.954],[38.957,21.951],[38.962,21.952],[38.961,21.954]]],[[[38.961,22.031],[38.959,22.03],[38.961,22.03],[38.961,22.031]]],[[[38.964,22.045],[38.969,22.046],[38.969,22.047],[38.964,22.045]]],[[[38.97,22.049],[38.97,22.048],[38.97,22.049],[38.97,22.049]]],[[[38.974,22.053],[38.973,22.053],[38.974,22.053],[38.974,22.053]]],[[[38.979,22.026],[38.98,22.023],[38.982,22.026],[38.979,22.026]]],[[[38.984,22.048],[38.986,22.045],[38.986,22.048],[38.984,22.048]]],[[[38.988,22.05],[38.99,22.048],[38.995,22.057],[38.988,22.05]]],[[[39.0,22.044],[38.998,22.035],[39.004,22.027],[39.0,22.044]]],[[[38.999,22.054],[39.004,22.047],[39.004,22.06],[38.999,22.054]]],[[[39.005,22.026],[39.003,22.024],[39.008,22.018],[39.005,22.026]]],[[[39.007,22.036],[39.007,22.035],[39.007,22.036],[39.007,22.036]]],[[[39.013,22.075],[39.012,22.074],[39.013,22.074],[39.013,22.075]]],[[[39.012,22.109],[39.012,22.107],[39.012,22.109],[39.012,22.109]]],[[[39.013,22.11],[39.014,22.11],[39.014,22.113],[39.013,22.11]]],[[[39.014,22.096],[39.014,22.095],[39.015,22.095],[39.014,22.096]]],[[[39.016,22.099],[39.016,22.098],[39.018,22.1],[39.016,22.099]]],[[[39.016,22.077],[39.019,22.075],[39.019,22.078],[39.016,22.077]]],[[[39.02,21.829],[39.024,21.83],[39.023,21.831],[39.02,21.829]]],[[[39.019,22.082],[39.021,22.082],[39.021,22.082],[39.019,22.082]]],[[[39.023,22.08],[39.022,22.078],[39.023,22.08],[39.023,22.08]]],[[[39.023,22.081],[39.024,22.08],[39.024,22.081],[39.023,22.081]]],[[[39.028,22.073],[39.028,22.071],[39.028,22.072],[39.028,22.073]]],[[[39.026,22.143],[39.026,22.141],[39.026,22.144],[39.026,22.143]]],[[[39.028,22.127],[39.028,22.126],[39.028,22.126],[39.028,22.127]]],[[[39.028,22.073],[39.03,22.072],[39.03,22.073],[39.028,22.073]]],[[[39.031,22.154],[39.033,22.152],[39.032,22.157],[39.031,22.154]]],[[[39.031,22.087],[39.03,22.086],[39.031,22.085],[39.031,22.087]]],[[[39.034,22.076],[39.033,22.069],[39.042,22.064],[39.034,22.076]]],[[[39.036,22.091],[39.033,22.087],[39.034,22.086],[39.036,22.091]]],[[[39.035,22.188],[39.033,22.18],[39.034,22.18],[39.035,22.183],[39.038,22.182],[39.039,22.186],[39.036,22.185],[39.035,22.188]]],[[[39.038,22.19],[39.037,22.187],[39.038,22.186],[39.038,22.19]]],[[[39.037,22.169],[39.037,22.167],[39.037,22.169],[39.037,22.169]]],[[[39.052,22.159],[39.053,22.158],[39.052,22.159],[39.052,22.159]]],[[[39.054,22.162],[39.055,22.16],[39.055,22.162],[39.054,22.162]]],[[[39.056,22.612],[39.058,22.606],[39.06,22.605],[39.056,22.612]]],[[[39.072,22.261],[39.072,22.26],[39.072,22.263],[39.072,22.261]]],[[[39.08,22.263],[39.08,22.262],[39.081,22.264],[39.08,22.263]]],[[[39.083,22.271],[39.081,22.27],[39.082,22.269],[39.083,22.271]]],[[[39.081,22.268],[39.081,22.266],[39.081,22.265],[39.081,22.268]]],[[[39.083,22.279],[39.083,22.273],[39.085,22.282],[39.083,22.279]]],[[[39.083,22.272],[39.083,22.27],[39.083,22.27],[39.083,22.272]]],[[[39.094,22.328],[39.094,22.303],[39.098,22.303],[39.094,22.328]]],[[[39.094,21.674],[39.094,21.673],[39.095,21.672],[39.094,21.674]]],[[[39.101,22.353],[39.103,22.352],[39.103,22.353],[39.101,22.353]]],[[[39.109,22.373],[39.112,22.37],[39.112,22.375],[39.109,22.373]]],[[[39.107,21.585],[39.107,21.585],[39.108,21.577],[39.107,21.585]]],[[[39.118,22.408],[39.118,22.407],[39.119,22.407],[39.118,22.408]]],[[[39.118,21.353],[39.118,21.352],[39.119,21.355],[39.118,21.353]]],[[[39.119,22.373],[39.119,22.372],[39.119,22.372],[39.119,22.373]]],[[[39.13,22.395],[39.129,22.392],[39.131,22.393],[39.13,22.395]]],[[[39.129,22.38],[39.13,22.38],[39.13,22.38],[39.129,22.38]]],[[[39.131,22.381],[39.131,22.381],[39.132,22.381],[39.131,22.381]]],[[[39.138,21.512],[39.136,21.51],[39.136,21.506],[39.138,21.512]]],[[[39.135,21.357],[39.135,21.357],[39.135,21.357],[39.135,21.357]]],[[[39.139,21.769],[39.138,21.764],[39.141,21.77],[39.139,21.769]]],[[[39.137,21.354],[39.137,21.353],[39.137,21.354],[39.137,21.354]]],[[[39.137,21.355],[39.138,21.355],[39.139,21.356],[39.137,21.355]]],[[[39.138,21.514],[39.138,21.513],[39.138,21.513],[39.138,21.514]]],[[[39.146,21.531],[39.14,21.52],[39.145,21.518],[39.146,21.531]]],[[[39.145,21.772],[39.145,21.77],[39.146,21.772],[39.145,21.772]]],[[[39.144,21.359],[39.146,21.359],[39.146,21.359],[39.144,21.359]]],[[[39.146,21.385],[39.147,21.383],[39.147,21.385],[39.146,21.385]]],[[[39.146,21.356],[39.146,21.355],[39.147,21.355],[39.146,21.356]]],[[[39.149,21.431],[39.149,21.423],[39.151,21.422],[39.149,21.431]]],[[[39.149,21.365],[39.15,21.364],[39.15,21.365],[39.149,21.365]]],[[[39.152,21.363],[39.152,21.362],[39.152,21.363],[39.152,21.363]]],[[[39.156,21.401],[39.155,21.399],[39.158,21.4],[39.156,21.401]]],[[[39.161,21.37],[39.162,21.369],[39.163,21.373],[39.161,21.37]]],[[[39.163,21.43],[39.164,21.429],[39.165,21.43],[39.163,21.43]]],[[[39.17,21.378],[39.17,21.373],[39.172,21.374],[39.17,21.378]]],[[[39.169,21.416],[39.17,21.415],[39.17,21.416],[39.169,21.416]]],[[[39.172,21.382],[39.172,21.38],[39.173,21.381],[39.172,21.382]]],[[[39.172,21.19],[39.173,21.189],[39.173,21.19],[39.172,21.19]]],[[[39.172,21.391],[39.173,21.391],[39.173,21.392],[39.172,21.391]]],[[[39.176,21.392],[39.177,21.392],[39.177,21.392],[39.176,21.392]]],[[[39.178,21.415],[39.177,21.414],[39.178,21.414],[39.178,21.415]]],[[[39.178,21.401],[39.179,21.4],[39.179,21.401],[39.178,21.401]]],[[[39.228,21.071],[39.231,21.067],[39.235,21.068],[39.238,21.067],[39.228,21.071]]],[[[39.235,21.067],[39.236,21.067],[39.236,21.067],[39.235,21.067]]],[[[39.236,21.066],[39.237,21.066],[39.237,21.066],[39.236,21.066]]],[[[39.248,21.056],[39.245,21.052],[39.249,21.052],[39.248,21.056]]],[[[39.35,20.899],[39.345,20.899],[39.355,20.893],[39.35,20.899]]],[[[39.344,20.918],[39.344,20.917],[39.344,20.918],[39.344,20.918]]],[[[39.344,20.921],[39.345,20.92],[39.345,20.921],[39.344,20.921]]],[[[39.345,20.917],[39.345,20.917],[39.346,20.917],[39.345,20.917]]],[[[39.349,20.915],[39.348,20.914],[39.35,20.914],[39.349,20.915]]],[[[39.349,20.917],[39.349,20.917],[39.349,20.918],[39.349,20.917]]],[[[39.35,20.918],[39.351,20.918],[39.351,20.918],[39.35,20.918]]],[[[39.36,20.902],[39.361,20.901],[39.361,20.902],[39.36,20.902]]],[[[39.37,20.898],[39.371,20.897],[39.371,20.898],[39.37,20.898]]],[[[39.438,20.824],[39.437,20.823],[39.44,20.824],[39.438,20.824]]],[[[39.436,20.818],[39.437,20.819],[39.437,20.819],[39.436,20.818]]],[[[39.441,20.823],[39.44,20.822],[39.443,20.822],[39.441,20.823]]],[[[39.464,20.767],[39.471,20.765],[39.473,20.768],[39.464,20.767]]],[[[39.471,20.763],[39.472,20.762],[39.472,20.763],[39.471,20.763]]],[[[39.473,20.771],[39.476,20.769],[39.476,20.772],[39.473,20.771]]],[[[39.486,20.76],[39.489,20.758],[39.489,20.76],[39.491,20.759],[39.491,20.759],[39.489,20.761],[39.486,20.76]]],[[[39.491,20.735],[39.492,20.734],[39.492,20.736],[39.491,20.735]]],[[[39.962,20.271],[39.962,20.267],[39.964,20.27],[39.962,20.271]]],[[[39.976,20.271],[39.976,20.269],[39.979,20.271],[39.976,20.271]]],[[[39.995,20.259],[40.027,20.234],[40.196,20.167],[40.09,20.231],[39.995,20.259]]],[[[40.015,20.261],[40.016,20.26],[40.016,20.261],[40.015,20.261]]],[[[40.016,20.26],[40.016,20.259],[40.017,20.259],[40.016,20.26]]],[[[40.018,20.258],[40.019,20.257],[40.019,20.258],[40.018,20.258]]],[[[40.036,20.258],[40.036,20.256],[40.037,20.256],[40.036,20.258]]],[[[40.047,20.263],[40.048,20.259],[40.067,20.252],[40.047,20.263]]],[[[40.041,20.252],[40.042,20.251],[40.043,20.25],[40.041,20.252]]],[[[40.044,20.25],[40.045,20.25],[40.045,20.25],[40.044,20.25]]],[[[40.051,20.262],[40.051,20.261],[40.051,20.261],[40.051,20.262]]],[[[40.053,20.247],[40.057,20.243],[40.06,20.242],[40.053,20.247]]],[[[40.054,20.26],[40.054,20.26],[40.054,20.26],[40.054,20.26]]],[[[40.056,20.26],[40.056,20.259],[40.057,20.259],[40.056,20.26]]],[[[40.073,20.25],[40.074,20.247],[40.076,20.247],[40.073,20.25]]],[[[40.076,20.248],[40.077,20.246],[40.077,20.247],[40.076,20.248]]],[[[40.077,20.245],[40.077,20.244],[40.077,20.245],[40.077,20.245]]],[[[40.078,20.277],[40.078,20.276],[40.078,20.276],[40.078,20.277]]],[[[40.084,20.244],[40.083,20.241],[40.087,20.24],[40.084,20.244]]],[[[40.08,20.262],[40.081,20.261],[40.081,20.262],[40.08,20.262]]],[[[40.209,20.169],[40.223,20.158],[40.228,20.162],[40.209,20.169]]],[[[40.221,20.166],[40.222,20.166],[40.222,20.166],[40.221,20.166]]],[[[40.582,19.773],[40.582,19.767],[40.592,19.767],[40.582,19.773]]],[[[40.599,19.77],[40.599,19.764],[40.6,19.77],[40.599,19.77]]],[[[40.605,19.773],[40.606,19.772],[40.606,19.773],[40.605,19.773]]],[[[40.605,19.779],[40.607,19.777],[40.607,19.779],[40.605,19.779]]],[[[40.606,19.771],[40.607,19.77],[40.607,19.771],[40.606,19.771]]],[[[40.647,19.726],[40.646,19.725],[40.65,19.724],[40.647,19.726]]],[[[40.673,19.76],[40.672,19.758],[40.674,19.757],[40.673,19.76]]],[[[40.685,19.727],[40.686,19.721],[40.688,19.72],[40.685,19.727]]],[[[40.689,19.718],[40.689,19.71],[40.697,19.696],[40.689,19.718]]],[[[40.692,19.764],[40.698,19.751],[40.702,19.755],[40.692,19.764]]],[[[40.705,19.691],[40.705,19.685],[40.709,19.682],[40.705,19.691]]],[[[40.703,19.7],[40.705,19.697],[40.706,19.699],[40.703,19.7]]],[[[40.707,19.713],[40.71,19.711],[40.711,19.713],[40.707,19.713]]],[[[40.709,19.675],[40.711,19.675],[40.711,19.676],[40.709,19.675]]],[[[40.736,19.689],[40.735,19.684],[40.736,19.687],[40.742,19.682],[40.758,19.68],[40.736,19.689]]],[[[40.736,19.685],[40.736,19.684],[40.736,19.685],[40.736,19.685]]],[[[40.744,19.641],[40.736,19.638],[40.743,19.639],[40.744,19.641]]],[[[40.74,19.552],[40.74,19.545],[40.742,19.546],[40.74,19.552]]],[[[40.741,19.54],[40.74,19.535],[40.743,19.532],[40.741,19.54]]],[[[40.74,19.544],[40.741,19.543],[40.741,19.545],[40.74,19.544]]],[[[40.746,19.52],[40.749,19.514],[40.75,19.518],[40.746,19.52]]],[[[40.744,19.542],[40.745,19.541],[40.746,19.544],[40.744,19.542]]],[[[40.757,19.678],[40.755,19.651],[40.758,19.656],[40.757,19.678]]],[[[40.746,19.547],[40.747,19.547],[40.747,19.548],[40.746,19.547]]],[[[40.751,19.664],[40.748,19.663],[40.748,19.66],[40.751,19.664]]],[[[40.758,19.527],[40.752,19.525],[40.76,19.523],[40.758,19.527]]],[[[40.772,19.635],[40.773,19.626],[40.777,19.623],[40.772,19.635]]],[[[40.774,19.516],[40.776,19.514],[40.777,19.513],[40.774,19.516]]],[[[40.773,19.626],[40.774,19.625],[40.773,19.626],[40.773,19.626]]],[[[40.773,19.624],[40.774,19.624],[40.774,19.624],[40.773,19.624]]],[[[40.775,19.623],[40.775,19.622],[40.776,19.621],[40.775,19.623]]],[[[40.781,19.598],[40.78,19.595],[40.782,19.598],[40.781,19.598]]],[[[40.787,19.509],[40.784,19.507],[40.784,19.503],[40.787,19.501],[40.787,19.509]]],[[[40.79,19.556],[40.791,19.554],[40.791,19.556],[40.79,19.556]]],[[[40.796,19.498],[40.798,19.495],[40.801,19.496],[40.796,19.498]]],[[[40.793,19.551],[40.794,19.551],[40.794,19.552],[40.793,19.551]]],[[[40.811,19.488],[40.811,19.479],[40.813,19.478],[40.811,19.488]]],[[[40.813,19.478],[40.813,19.478],[40.813,19.478],[40.813,19.478]]],[[[40.815,19.477],[40.815,19.476],[40.815,19.476],[40.815,19.477]]],[[[40.817,19.475],[40.821,19.442],[40.827,19.435],[40.822,19.473],[40.817,19.475]]],[[[40.831,19.431],[40.83,19.431],[40.832,19.425],[40.832,19.425],[40.831,19.431]]],[[[40.844,19.415],[40.843,19.414],[40.85,19.404],[40.844,19.415]]],[[[40.869,19.381],[40.869,19.381],[40.869,19.381],[40.869,19.381]]],[[[40.874,19.377],[40.871,19.371],[40.874,19.372],[40.874,19.377]]],[[[40.884,19.514],[40.885,19.513],[40.885,19.514],[40.884,19.514]]],[[[40.898,19.287],[40.889,19.273],[40.895,19.271],[40.898,19.287]]],[[[40.891,19.51],[40.891,19.508],[40.892,19.509],[40.891,19.51]]],[[[40.891,19.505],[40.892,19.504],[40.892,19.505],[40.891,19.505]]],[[[40.896,19.499],[40.894,19.497],[40.895,19.496],[40.896,19.499]]],[[[40.899,19.284],[40.9,19.283],[40.901,19.282],[40.899,19.284]]],[[[40.906,19.486],[40.907,19.482],[40.908,19.482],[40.906,19.486]]],[[[40.905,19.281],[40.906,19.278],[40.907,19.279],[40.905,19.281]]],[[[40.91,19.273],[40.909,19.272],[40.911,19.272],[40.91,19.273]]],[[[40.915,19.474],[40.916,19.471],[40.918,19.471],[40.915,19.474]]],[[[40.927,19.456],[40.926,19.453],[40.928,19.453],[40.927,19.456]]],[[[40.977,19.267],[40.978,19.263],[40.98,19.263],[40.977,19.267]]],[[[40.977,19.271],[40.976,19.27],[40.977,19.27],[40.977,19.271]]],[[[40.978,19.312],[40.978,19.311],[40.978,19.312],[40.978,19.312]]],[[[40.981,19.248],[40.98,19.247],[40.981,19.247],[40.981,19.248]]],[[[40.985,19.274],[40.986,19.272],[40.988,19.274],[40.985,19.274]]],[[[41.005,19.271],[41.006,19.27],[41.005,19.271],[41.005,19.271]]],[[[41.022,19.249],[41.023,19.249],[41.023,19.249],[41.022,19.249]]],[[[41.022,19.259],[41.022,19.259],[41.022,19.259],[41.022,19.259]]],[[[41.041,19.043],[41.041,19.041],[41.043,19.042],[41.041,19.043]]],[[[41.071,19.121],[41.07,19.121],[41.071,19.12],[41.071,19.121]]],[[[41.078,18.974],[41.077,18.973],[41.078,18.973],[41.078,18.974]]],[[[41.095,19.085],[41.094,19.084],[41.095,19.084],[41.095,19.085]]],[[[41.101,18.984],[41.102,18.982],[41.103,18.984],[41.101,18.984]]],[[[41.122,18.979],[41.123,18.979],[41.122,18.979],[41.122,18.979]]],[[[41.126,18.965],[41.127,18.965],[41.127,18.965],[41.126,18.965]]],[[[41.17,18.876],[41.169,18.874],[41.171,18.874],[41.17,18.876]]],[[[41.428,18.478],[41.426,18.47],[41.428,18.469],[41.428,18.478]]],[[[41.433,18.459],[41.428,18.461],[41.43,18.458],[41.433,18.459]]],[[[41.428,18.468],[41.43,18.466],[41.429,18.469],[41.428,18.468]]],[[[41.435,18.477],[41.433,18.476],[41.435,18.477],[41.435,18.477]]],[[[41.43,18.474],[41.433,18.471],[41.432,18.475],[41.43,18.474]]],[[[41.487,18.276],[41.484,18.279],[41.486,18.276],[41.487,18.276]]],[[[41.485,18.283],[41.486,18.282],[41.486,18.283],[41.485,18.283]]],[[[41.572,18.122],[41.574,18.114],[41.576,18.118],[41.572,18.122]]]]}},{"type":"Feature","properties":{"name":"Northern Region","ar":"الحدود الشمالية"},"geometry":{"type":"Polygon","coordinates":[[[37.889,31.221],[38.001,31.203],[38.056,31.146],[38.096,31.161],[38.075,31.104],[38.156,31.089],[38.163,30.915],[38.194,30.859],[38.558,30.934],[38.734,30.93],[38.792,30.882],[38.98,30.967],[39.209,30.969],[39.314,30.951],[39.414,30.891],[39.65,30.915],[39.755,30.855],[39.869,30.89],[40.094,30.735],[40.199,30.747],[40.299,30.826],[40.69,30.737],[41.011,30.762],[41.101,30.73],[41.113,30.51],[41.197,30.579],[41.418,30.588],[41.633,30.521],[41.559,30.431],[41.569,30.373],[41.743,30.322],[41.979,30.089],[41.79,30.024],[41.749,29.91],[41.593,29.92],[41.503,29.818],[41.402,29.804],[41.422,29.531],[41.512,29.55],[41.505,29.444],[41.592,29.312],[41.608,29.141],[41.416,29.106],[41.349,28.873],[41.908,28.805],[42.047,28.88],[42.128,28.823],[42.473,28.759],[42.528,28.73],[42.579,28.625],[42.673,28.62],[42.788,28.567],[42.778,28.452],[42.832,28.425],[42.824,28.387],[42.893,28.406],[43.098,28.327],[43.264,28.429],[43.397,28.404],[43.437,28.434],[43.465,28.36],[43.481,28.444],[43.566,28.418],[43.671,28.46],[43.802,28.41],[43.85,28.434],[43.915,28.346],[43.882,28.259],[43.94,28.078],[43.911,27.954],[43.974,27.896],[44.083,27.965],[44.284,27.922],[44.531,27.753],[44.721,27.525],[44.93,27.605],[45.043,27.742],[45.046,27.788],[45.142,27.877],[45.217,28.137],[45.352,28.198],[45.263,28.428],[45.052,28.648],[45.147,28.729],[45.148,28.783],[45.652,28.785],[45.705,28.873],[45.754,28.875],[45.789,28.929],[46.005,29.024],[46.051,29.092],[44.715,29.196],[42.086,31.112],[41.441,31.373],[40.413,31.948],[39.201,32.154],[39.006,32.001],[37.964,31.744],[37.937,31.624],[37.962,31.375],[37.889,31.221]]]}},{"type":"Feature","properties":{"name":"Jawf","ar":"الجوف"},"geometry":{"type":"Polygon","coordinates":[[[37.006,31.501],[37.997,30.501],[37.666,30.333],[37.502,30.0],[37.604,29.896],[37.922,29.697],[38.205,29.606],[38.397,29.505],[38.251,29.321],[38.204,29.225],[38.223,29.185],[38.488,29.254],[38.581,29.236],[38.967,29.015],[39.313,28.752],[39.718,28.616],[39.791,28.545],[40.538,28.887],[41.349,28.873],[41.416,29.106],[41.608,29.141],[41.592,29.312],[41.505,29.444],[41.512,29.55],[41.422,29.531],[41.419,29.755],[41.395,29.791],[41.503,29.818],[41.593,29.92],[41.749,29.91],[41.79,30.024],[41.979,30.089],[41.743,30.322],[41.569,30.373],[41.559,30.431],[41.633,30.521],[41.418,30.588],[41.197,30.579],[41.113,30.51],[41.101,30.73],[41.011,30.762],[40.69,30.737],[40.299,30.826],[40.199,30.747],[40.094,30.735],[39.869,30.89],[39.755,30.855],[39.65,30.915],[39.414,30.891],[39.314,30.951],[39.209,30.969],[38.98,30.967],[38.792,30.882],[38.734,30.93],[38.558,30.934],[38.194,30.859],[38.163,30.915],[38.156,31.089],[38.075,31.104],[38.096,31.161],[38.056,31.146],[38.001,31.203],[37.89,31.214],[37.962,31.375],[37.937,31.624],[37.964,31.744],[37.006,31.501]]]}},{"type":"Feature","properties":{"name":"Hail","ar":"حائل"},"geometry":{"type":"Polygon","coordinates":[[[39.365,28.04],[39.403,27.981],[39.704,27.866],[39.832,27.765],[39.908,27.606],[39.925,27.428],[40.011,27.279],[39.986,27.123],[39.898,27.165],[39.887,27.209],[39.786,27.23],[39.733,27.12],[39.508,26.866],[39.493,26.811],[39.514,26.753],[39.659,26.731],[39.668,26.667],[39.761,26.598],[39.886,26.398],[39.888,26.264],[39.962,26.15],[39.978,25.431],[40.11,25.344],[40.454,25.291],[40.457,25.383],[40.497,25.431],[40.714,25.417],[40.865,25.576],[41.064,25.568],[41.152,25.497],[41.237,25.48],[41.353,25.574],[41.458,25.735],[41.678,25.725],[41.727,25.813],[41.818,25.882],[41.826,25.967],[41.923,25.954],[41.911,26.0],[41.948,26.096],[42.032,26.127],[42.071,26.18],[42.16,26.155],[42.19,26.189],[42.202,26.238],[42.162,26.345],[42.278,26.468],[42.338,26.476],[42.36,26.422],[42.405,26.515],[42.457,26.506],[42.618,26.613],[42.713,26.747],[42.711,26.823],[42.89,26.87],[42.939,26.92],[43.011,26.878],[43.117,26.96],[43.216,27.119],[43.214,27.209],[43.338,27.25],[43.334,27.285],[43.265,27.312],[43.286,27.414],[43.383,27.431],[43.415,27.496],[43.475,27.471],[43.509,27.502],[43.716,27.517],[43.703,27.738],[43.732,27.946],[43.928,28.109],[43.882,28.259],[43.915,28.346],[43.85,28.434],[43.802,28.41],[43.671,28.46],[43.566,28.418],[43.481,28.444],[43.465,28.36],[43.437,28.434],[43.397,28.404],[43.264,28.429],[43.105,28.327],[42.893,28.406],[42.832,28.382],[42.829,28.429],[42.778,28.452],[42.799,28.546],[42.776,28.576],[42.579,28.625],[42.528,28.73],[42.473,28.759],[42.128,28.823],[42.055,28.878],[41.908,28.805],[41.432,28.875],[40.671,28.893],[40.531,28.885],[39.791,28.545],[39.691,28.406],[39.456,28.187],[39.365,28.04]]]}},{"type":"Feature","properties":{"name":"Bahah","ar":"الباحة"},"geometry":{"type":"Polygon","coordinates":[[[40.793,20.065],[40.954,19.954],[40.978,19.557],[41.108,19.479],[41.19,19.377],[41.331,19.38],[41.482,19.746],[41.52,19.779],[41.698,19.793],[41.822,20.036],[41.84,20.182],[42.031,20.311],[42.036,20.374],[41.97,20.449],[42.032,20.625],[41.931,20.684],[41.774,20.608],[41.653,20.614],[41.519,20.566],[41.464,20.606],[41.391,20.748],[41.284,20.756],[41.225,20.66],[41.253,20.471],[41.136,20.247],[40.911,20.196],[40.793,20.065]]]}},{"type":"Feature","properties":{"name":"Jizan","ar":"جازان"},"geometry":{"type":"MultiPolygon","coordinates":[[[[41.462,16.891],[41.46,16.886],[41.471,16.89],[41.462,16.891]]],[[[41.505,16.805],[41.504,16.8],[41.513,16.806],[41.505,16.805]]],[[[41.553,16.821],[41.551,16.815],[41.555,16.82],[41.553,16.821]]],[[[41.569,16.899],[41.584,16.829],[41.635,16.813],[41.615,16.827],[41.569,16.899]]],[[[41.588,16.686],[41.58,16.681],[41.604,16.683],[41.588,16.686]]],[[[41.584,16.892],[41.607,16.849],[41.62,16.831],[41.628,16.828],[41.584,16.892]]],[[[41.585,18.094],[41.643,18.051],[41.638,17.999],[41.674,18.006],[41.663,17.978],[41.779,17.861],[41.775,17.838],[41.891,17.806],[41.877,17.789],[42.115,17.626],[42.138,17.6],[42.136,17.573],[42.14,17.562],[42.144,17.558],[42.18,17.559],[42.275,17.448],[42.316,17.44],[42.372,17.015],[42.369,17.102],[42.397,17.116],[42.359,17.19],[42.425,17.159],[42.415,17.105],[42.452,17.056],[42.556,17.003],[42.525,16.883],[42.633,16.823],[42.708,16.732],[42.686,16.74],[42.737,16.669],[42.707,16.672],[42.731,16.662],[42.715,16.568],[42.778,16.469],[42.765,16.418],[42.761,16.417],[42.754,16.412],[42.755,16.412],[42.831,16.38],[42.956,16.402],[42.95,16.497],[43.121,16.529],[43.129,16.672],[43.235,16.643],[43.212,16.71],[43.226,16.746],[43.275,16.747],[43.267,16.795],[43.18,16.849],[43.138,16.918],[43.195,16.945],[43.181,17.032],[43.249,17.015],[43.227,17.075],[43.16,17.087],[43.171,17.173],[43.216,17.21],[43.202,17.259],[43.336,17.304],[43.228,17.386],[43.241,17.481],[43.321,17.533],[43.229,17.645],[43.124,17.677],[43.047,17.806],[42.942,17.857],[42.938,18.0],[42.875,17.997],[42.77,17.926],[42.687,17.68],[42.629,17.658],[42.491,17.763],[42.408,17.901],[42.167,17.912],[42.09,18.048],[41.921,18.055],[41.939,18.278],[41.9,18.327],[41.771,18.314],[41.723,18.238],[41.622,18.181],[41.585,18.094]]],[[[41.591,18.06],[41.59,18.059],[41.591,18.058],[41.591,18.06]]],[[[41.644,17.003],[41.641,16.998],[41.645,17.0],[41.644,17.003]]],[[[41.654,17.02],[41.655,17.01],[41.66,17.016],[41.654,17.02]]],[[[41.644,17.013],[41.644,17.013],[41.645,17.013],[41.644,17.013]]],[[[41.651,17.021],[41.651,17.02],[41.651,17.021],[41.651,17.021]]],[[[41.651,16.919],[41.68,16.891],[41.727,16.932],[41.682,16.962],[41.651,16.919]]],[[[41.682,17.957],[41.673,17.953],[41.681,17.949],[41.682,17.957]]],[[[41.672,16.975],[41.673,16.972],[41.676,16.975],[41.672,16.975]]],[[[41.728,16.922],[41.714,16.904],[41.735,16.919],[41.728,16.922]]],[[[41.722,16.729],[41.76,16.697],[41.833,16.679],[41.793,16.728],[41.722,16.729]]],[[[41.739,16.65],[41.737,16.649],[41.741,16.648],[41.739,16.65]]],[[[41.735,16.807],[41.753,16.787],[41.76,16.802],[41.735,16.807]]],[[[41.75,17.065],[41.741,17.05],[41.772,17.052],[41.75,17.065]]],[[[41.748,16.912],[41.747,16.908],[41.75,16.91],[41.748,16.912]]],[[[41.758,16.593],[41.755,16.588],[41.76,16.594],[41.758,16.593]]],[[[41.755,16.89],[41.789,16.84],[41.773,16.807],[41.815,16.805],[41.872,16.727],[41.976,16.667],[42.102,16.685],[42.113,16.654],[42.074,16.63],[42.187,16.586],[42.197,16.71],[42.161,16.69],[42.181,16.722],[42.124,16.745],[42.087,16.819],[42.033,16.751],[42.082,16.722],[42.034,16.709],[42.001,16.749],[41.898,16.752],[41.855,16.843],[41.755,16.89]]],[[[41.788,16.986],[41.799,16.952],[41.822,16.968],[41.808,16.981],[41.788,16.986]]],[[[41.794,17.012],[41.792,17.005],[41.799,17.008],[41.794,17.012]]],[[[41.79,16.664],[41.793,16.659],[41.792,16.665],[41.79,16.664]]],[[[41.804,16.553],[41.804,16.552],[41.808,16.554],[41.804,16.553]]],[[[41.817,16.652],[41.819,16.647],[41.819,16.647],[41.817,16.652]]],[[[41.837,16.899],[41.881,16.82],[42.011,16.762],[41.923,16.841],[41.99,16.87],[41.935,16.903],[41.934,16.952],[41.837,16.899]]],[[[41.843,16.667],[41.862,16.646],[41.885,16.639],[41.874,16.656],[41.843,16.667]]],[[[41.847,17.012],[41.888,17.001],[41.942,16.952],[41.937,16.98],[41.886,17.008],[41.847,17.012]]],[[[41.876,16.47],[41.881,16.467],[41.88,16.472],[41.876,16.47]]],[[[41.892,16.985],[41.892,16.982],[41.893,16.982],[41.892,16.985]]],[[[41.898,16.98],[41.896,16.978],[41.898,16.978],[41.898,16.98]]],[[[41.9,16.415],[41.901,16.413],[41.903,16.417],[41.9,16.415]]],[[[41.906,16.429],[41.902,16.418],[41.915,16.422],[41.906,16.429]]],[[[41.905,17.096],[41.904,17.096],[41.906,17.094],[41.905,17.096]]],[[[41.922,16.631],[41.916,16.617],[41.928,16.614],[41.922,16.631]]],[[[41.907,17.101],[41.908,17.1],[41.908,17.101],[41.907,17.101]]],[[[41.93,17.082],[41.92,17.078],[41.936,17.072],[41.93,17.082]]],[[[41.922,17.016],[41.924,17.013],[41.926,17.014],[41.922,17.016]]],[[[41.926,17.094],[41.937,17.077],[41.94,17.077],[41.926,17.094]]],[[[41.945,17.07],[41.944,17.068],[41.949,17.064],[41.945,17.07]]],[[[41.945,16.952],[41.942,16.942],[41.947,16.941],[41.945,16.952]]],[[[41.954,16.998],[41.956,16.993],[41.955,16.998],[41.954,16.998]]],[[[41.956,17.067],[41.957,17.065],[41.957,17.068],[41.956,17.067]]],[[[41.965,17.046],[41.964,17.045],[41.967,17.042],[41.965,17.046]]],[[[41.973,17.042],[41.974,17.039],[41.975,17.039],[41.973,17.042]]],[[[41.98,16.599],[41.984,16.589],[41.995,16.6],[41.98,16.599]]],[[[41.987,16.882],[41.988,16.88],[41.988,16.882],[41.987,16.882]]],[[[41.991,16.831],[42.03,16.828],[42.04,16.838],[42.024,16.843],[41.991,16.831]]],[[[41.998,16.804],[41.994,16.797],[41.999,16.799],[41.998,16.804]]],[[[41.997,16.623],[42.018,16.604],[42.016,16.623],[42.035,16.633],[42.026,16.621],[42.032,16.599],[42.042,16.647],[41.997,16.623]]],[[[42.02,16.786],[42.01,16.77],[42.016,16.768],[42.02,16.786]]],[[[42.036,16.55],[42.054,16.524],[42.074,16.556],[42.056,16.539],[42.058,16.563],[42.036,16.55]]],[[[42.18,17.552],[42.178,17.553],[42.181,17.55],[42.18,17.552]]],[[[42.19,16.735],[42.189,16.726],[42.19,16.733],[42.19,16.735]]],[[[42.193,16.734],[42.192,16.719],[42.198,16.736],[42.193,16.734]]],[[[42.197,16.729],[42.203,16.731],[42.202,16.733],[42.197,16.729]]],[[[42.205,16.741],[42.199,16.736],[42.202,16.735],[42.205,16.738],[42.205,16.741]]],[[[42.208,16.722],[42.202,16.718],[42.208,16.713],[42.208,16.722]]],[[[42.213,16.763],[42.213,16.743],[42.217,16.764],[42.213,16.763]]],[[[42.221,16.732],[42.216,16.727],[42.223,16.731],[42.221,16.732]]],[[[42.232,16.738],[42.228,16.736],[42.234,16.733],[42.232,16.738]]],[[[42.238,16.58],[42.234,16.579],[42.239,16.577],[42.238,16.58]]],[[[42.236,16.435],[42.262,16.427],[42.262,16.411],[42.271,16.409],[42.273,16.427],[42.236,16.435]]],[[[42.247,16.515],[42.248,16.511],[42.252,16.516],[42.247,16.515]]],[[[42.254,16.634],[42.252,16.631],[42.254,16.632],[42.254,16.634]]],[[[42.261,16.615],[42.257,16.607],[42.257,16.606],[42.261,16.615]]],[[[42.258,16.602],[42.257,16.599],[42.26,16.598],[42.258,16.602]]],[[[42.264,16.595],[42.264,16.588],[42.272,16.59],[42.264,16.595]]],[[[42.295,16.488],[42.302,16.487],[42.303,16.489],[42.295,16.488]]],[[[42.302,17.044],[42.305,17.043],[42.304,17.045],[42.302,17.044]]],[[[42.317,16.863],[42.32,16.86],[42.322,16.866],[42.317,16.863]]],[[[42.328,16.575],[42.329,16.573],[42.332,16.576],[42.328,16.575]]],[[[42.341,16.6],[42.342,16.597],[42.343,16.599],[42.341,16.6]]],[[[42.362,16.577],[42.36,16.573],[42.361,16.573],[42.362,16.577]]],[[[42.399,16.419],[42.399,16.418],[42.401,16.418],[42.399,16.419]]],[[[42.403,17.155],[42.402,17.149],[42.409,17.15],[42.403,17.155]]],[[[42.432,16.984],[42.415,16.99],[42.433,16.982],[42.432,16.984]]],[[[42.41,16.889],[42.411,16.879],[42.419,16.884],[42.41,16.889]]],[[[42.415,16.985],[42.412,16.985],[42.416,16.982],[42.415,16.985]]],[[[42.435,16.424],[42.431,16.422],[42.437,16.422],[42.435,16.424]]],[[[42.439,16.447],[42.438,16.444],[42.44,16.445],[42.439,16.447]]],[[[42.451,16.796],[42.447,16.786],[42.456,16.778],[42.451,16.796]]],[[[42.454,16.815],[42.453,16.813],[42.455,16.813],[42.454,16.815]]],[[[42.456,16.771],[42.456,16.768],[42.458,16.768],[42.456,16.771]]],[[[42.464,16.811],[42.461,16.807],[42.464,16.809],[42.464,16.811]]],[[[42.498,16.414],[42.499,16.412],[42.499,16.413],[42.498,16.414]]],[[[42.554,16.692],[42.55,16.677],[42.561,16.69],[42.554,16.692]]],[[[42.565,16.723],[42.563,16.721],[42.567,16.721],[42.565,16.723]]],[[[42.64,16.43],[42.64,16.423],[42.648,16.429],[42.64,16.43]]]]}},{"type":"Feature","properties":{"name":"Asir","ar":"عسير"},"geometry":{"type":"Polygon","coordinates":[[[41.382,18.964],[41.43,18.797],[41.667,18.777],[41.728,18.744],[41.814,18.491],[41.771,18.314],[41.9,18.327],[41.937,18.298],[41.921,18.055],[42.09,18.048],[42.167,17.912],[42.408,17.901],[42.491,17.763],[42.585,17.675],[42.65,17.657],[42.687,17.68],[42.77,17.926],[42.917,18.011],[42.946,17.979],[42.942,17.857],[43.047,17.806],[43.124,17.677],[43.229,17.645],[43.321,17.533],[43.42,17.566],[43.485,17.545],[43.618,17.426],[43.674,17.58],[43.634,17.725],[43.676,17.998],[43.639,18.214],[43.992,18.566],[44.081,18.719],[44.265,18.775],[44.369,18.853],[44.402,18.973],[44.351,19.209],[44.371,19.253],[44.516,19.345],[44.517,19.512],[44.124,19.845],[43.931,20.101],[43.96,20.312],[44.057,20.478],[44.059,20.559],[43.835,20.839],[43.667,20.976],[43.385,20.833],[43.234,20.869],[42.944,20.813],[42.821,20.709],[42.635,20.626],[42.274,20.342],[42.167,20.377],[42.032,20.625],[41.97,20.449],[42.039,20.33],[41.84,20.182],[41.822,20.036],[41.698,19.797],[41.809,19.814],[41.862,19.762],[41.83,19.53],[41.894,19.408],[41.857,19.281],[41.791,19.221],[41.588,19.223],[41.476,19.145],[41.397,19.195],[41.382,18.964]]]}},{"type":"Feature","properties":{"name":"Najran","ar":"نجران"},"geometry":{"type":"Polygon","coordinates":[[[43.618,17.426],[43.683,17.367],[43.789,17.375],[43.832,17.339],[43.967,17.331],[44.011,17.402],[44.067,17.406],[44.111,17.366],[44.138,17.409],[44.366,17.433],[44.567,17.406],[44.65,17.433],[45.217,17.433],[45.4,17.333],[46.1,17.25],[46.367,17.233],[46.75,17.283],[47.0,16.95],[47.183,16.95],[47.467,17.117],[47.512,17.774],[47.745,19.531],[46.974,19.392],[45.266,19.254],[44.915,19.293],[44.517,19.512],[44.516,19.345],[44.371,19.253],[44.351,19.209],[44.402,18.973],[44.369,18.853],[44.265,18.775],[44.081,18.719],[43.992,18.566],[43.639,18.214],[43.676,17.998],[43.634,17.725],[43.674,17.58],[43.618,17.426]]]}},{"type":"Feature","properties":{"name":"Eastern Region","ar":"المنطقة الشرقية"},"geometry":{"type":"MultiPolygon","coordinates":[[[[44.979,27.673],[45.045,27.628],[45.189,27.283],[45.247,27.228],[45.527,27.085],[45.693,27.058],[45.934,26.85],[46.231,26.82],[46.589,26.608],[46.831,26.627],[47.06,26.403],[47.43,26.266],[47.474,26.069],[47.467,25.076],[47.497,24.782],[47.596,24.687],[47.869,24.52],[48.136,24.277],[48.236,24.139],[48.289,24.0],[48.309,23.677],[47.512,17.774],[47.467,17.117],[47.6,17.45],[48.183,18.167],[49.117,18.617],[50.783,18.789],[52.0,19.0],[55.0,20.0],[55.667,22.0],[55.209,22.709],[55.137,22.632],[52.581,22.939],[51.59,24.127],[51.589,24.255],[51.534,24.251],[51.445,24.326],[51.277,24.294],[51.323,24.43],[51.505,24.575],[51.4,24.625],[51.402,24.6],[51.311,24.507],[51.099,24.471],[50.928,24.547],[50.812,24.744],[50.769,24.72],[50.728,24.872],[50.684,24.89],[50.585,25.068],[50.587,25.032],[50.562,25.044],[50.559,25.183],[50.523,25.231],[50.532,25.301],[50.493,25.403],[50.381,25.512],[50.362,25.503],[50.396,25.453],[50.408,25.409],[50.399,25.412],[50.219,25.62],[50.209,25.681],[50.189,25.66],[50.156,25.695],[50.134,25.731],[50.137,25.741],[50.235,25.683],[50.265,25.612],[50.263,25.672],[50.109,25.882],[50.133,25.931],[50.109,25.98],[50.033,26.022],[50.0,25.989],[50.013,26.08],[49.988,26.113],[50.033,26.202],[50.142,26.057],[50.132,26.03],[50.156,26.039],[50.146,26.05],[50.153,26.053],[50.156,26.051],[50.156,26.052],[50.15,26.067],[50.162,26.095],[50.166,26.127],[50.16,26.13],[50.162,26.136],[50.172,26.142],[50.175,26.139],[50.175,26.139],[50.173,26.144],[50.163,26.143],[50.169,26.179],[50.192,26.154],[50.24,26.218],[50.214,26.224],[50.241,26.371],[50.202,26.395],[50.216,26.42],[50.184,26.417],[50.22,26.49],[50.217,26.49],[50.22,26.501],[50.22,26.502],[50.214,26.478],[50.197,26.48],[50.208,26.483],[50.212,26.503],[50.199,26.516],[50.188,26.49],[50.198,26.524],[50.132,26.432],[50.135,26.497],[50.104,26.457],[50.106,26.486],[50.07,26.47],[50.039,26.509],[50.022,26.57],[50.089,26.538],[50.091,26.571],[50.078,26.592],[50.079,26.6],[50.082,26.602],[50.083,26.603],[50.083,26.605],[50.083,26.605],[50.082,26.606],[50.021,26.571],[50.023,26.655],[49.986,26.66],[49.995,26.745],[50.038,26.67],[50.122,26.683],[50.162,26.627],[50.164,26.639],[49.997,26.821],[49.955,26.853],[49.869,26.86],[49.861,26.901],[49.846,26.877],[49.782,26.899],[49.672,26.98],[49.668,27.013],[49.681,27.011],[49.683,27.013],[49.686,27.014],[49.698,27.025],[49.7,27.031],[49.646,27.023],[49.616,27.055],[49.703,27.071],[49.702,27.099],[49.617,27.061],[49.628,27.118],[49.61,27.073],[49.612,27.103],[49.602,27.074],[49.584,27.092],[49.568,27.146],[49.585,27.168],[49.589,27.207],[49.614,27.155],[49.589,27.208],[49.627,27.284],[49.555,27.164],[49.488,27.304],[49.528,27.335],[49.562,27.322],[49.565,27.281],[49.632,27.315],[49.651,27.299],[49.698,27.294],[49.702,27.301],[49.548,27.354],[49.486,27.345],[49.454,27.282],[49.457,27.277],[49.457,27.269],[49.46,27.264],[49.472,27.259],[49.462,27.273],[49.485,27.298],[49.464,27.235],[49.534,27.196],[49.495,27.162],[49.522,27.119],[49.446,27.113],[49.432,27.144],[49.42,27.098],[49.46,27.099],[49.469,27.082],[49.442,27.081],[49.366,27.126],[49.412,27.195],[49.364,27.191],[49.351,27.141],[49.321,27.181],[49.319,27.326],[49.284,27.343],[49.218,27.311],[49.233,27.368],[49.272,27.386],[49.253,27.409],[49.203,27.375],[49.123,27.406],[49.139,27.441],[49.165,27.422],[49.189,27.445],[49.184,27.417],[49.295,27.461],[49.312,27.425],[49.304,27.475],[49.223,27.534],[49.222,27.57],[49.127,27.538],[49.039,27.561],[48.969,27.622],[48.904,27.565],[48.897,27.589],[48.916,27.625],[48.877,27.596],[48.849,27.603],[48.85,27.628],[48.874,27.607],[48.85,27.642],[48.878,27.64],[48.881,27.673],[48.863,27.658],[48.847,27.659],[48.816,27.743],[48.803,27.711],[48.784,27.713],[48.811,27.819],[48.828,27.83],[48.83,27.829],[48.806,27.751],[48.837,27.763],[48.842,27.813],[48.87,27.792],[48.844,27.722],[48.891,27.767],[48.89,27.819],[48.748,27.953],[48.747,27.979],[48.793,27.999],[48.693,28.016],[48.622,28.086],[48.61,28.162],[48.621,28.192],[48.63,28.198],[48.634,28.194],[48.631,28.188],[48.636,28.195],[48.514,28.333],[48.542,28.41],[48.53,28.417],[48.503,28.384],[48.469,28.383],[48.53,28.419],[48.5,28.439],[48.501,28.495],[48.431,28.534],[47.704,28.524],[47.605,28.655],[47.585,28.836],[47.465,29.0],[46.563,29.1],[46.425,29.059],[46.051,29.092],[46.005,29.024],[45.789,28.929],[45.754,28.875],[45.705,28.873],[45.652,28.785],[45.158,28.786],[45.147,28.729],[45.052,28.663],[45.278,28.407],[45.353,28.209],[45.332,28.174],[45.217,28.137],[45.142,27.877],[44.979,27.673]]],[[[48.63,28.183],[48.624,28.153],[48.649,28.183],[48.647,28.184],[48.63,28.183]]],[[[48.631,28.19],[48.63,28.189],[48.63,28.188],[48.631,28.19]]],[[[48.638,28.115],[48.63,28.112],[48.638,28.114],[48.638,28.115]]],[[[48.641,28.108],[48.641,28.107],[48.642,28.107],[48.641,28.108]]],[[[48.759,27.981],[48.759,27.98],[48.76,27.981],[48.759,27.981]]],[[[48.826,27.902],[48.825,27.9],[48.825,27.9],[48.826,27.902]]],[[[48.825,27.904],[48.826,27.902],[48.826,27.904],[48.828,27.904],[48.828,27.905],[48.825,27.904]]],[[[48.861,27.607],[48.861,27.602],[48.863,27.601],[48.861,27.607]]],[[[48.904,27.575],[48.903,27.574],[48.905,27.572],[48.904,27.575]]],[[[49.227,27.415],[49.212,27.394],[49.226,27.397],[49.227,27.415]]],[[[49.222,27.32],[49.222,27.319],[49.224,27.321],[49.222,27.32]]],[[[49.226,27.323],[49.225,27.323],[49.227,27.323],[49.226,27.323]]],[[[49.284,27.365],[49.313,27.361],[49.316,27.384],[49.302,27.38],[49.284,27.365]]],[[[49.301,27.422],[49.302,27.422],[49.303,27.422],[49.301,27.422]]],[[[49.308,27.424],[49.306,27.419],[49.308,27.422],[49.308,27.424]]],[[[49.335,27.252],[49.349,27.242],[49.352,27.258],[49.335,27.252]]],[[[49.365,27.212],[49.366,27.208],[49.369,27.227],[49.365,27.212]]],[[[49.417,27.169],[49.414,27.166],[49.418,27.168],[49.418,27.169],[49.417,27.169]]],[[[49.494,27.148],[49.486,27.132],[49.505,27.126],[49.494,27.148]]],[[[49.54,27.304],[49.543,27.302],[49.543,27.303],[49.54,27.304]]],[[[49.586,27.127],[49.585,27.108],[49.59,27.128],[49.586,27.127]]],[[[49.586,27.149],[49.59,27.147],[49.609,27.141],[49.598,27.145],[49.586,27.149]]],[[[49.677,27.004],[49.676,27.003],[49.677,27.003],[49.677,27.004]]],[[[50.05,26.594],[50.046,26.594],[50.05,26.593],[50.05,26.594]]],[[[50.162,26.137],[50.166,26.128],[50.17,26.132],[50.162,26.137]]],[[[50.298,25.573],[50.333,25.542],[50.352,25.505],[50.339,25.563],[50.298,25.573]]],[[[50.353,25.504],[50.352,25.503],[50.354,25.503],[50.353,25.504]]],[[[50.397,25.433],[50.395,25.433],[50.397,25.432],[50.397,25.433]]],[[[50.398,25.431],[50.398,25.431],[50.398,25.431],[50.398,25.431]]],[[[50.427,25.479],[50.424,25.479],[50.425,25.474],[50.427,25.479]]],[[[50.747,24.823],[50.747,24.82],[50.747,24.822],[50.747,24.823]]],[[[51.382,24.584],[51.382,24.584],[51.382,24.584],[51.382,24.584]]],[[[51.383,24.585],[51.383,24.585],[51.383,24.585],[51.383,24.585]]],[[[51.383,24.585],[51.383,24.585],[51.384,24.586],[51.383,24.585]]],[[[51.384,24.592],[51.384,24.592],[51.384,24.592],[51.384,24.592]]],[[[51.391,24.612],[51.391,24.612],[51.391,24.611],[51.391,24.612]]],[[[51.394,24.613],[51.394,24.613],[51.394,24.613],[51.394,24.613]]],[[[51.394,24.599],[51.394,24.599],[51.394,24.599],[51.394,24.599]]],[[[51.394,24.599],[51.394,24.599],[51.394,24.6],[51.394,24.599]]],[[[51.395,24.6],[51.395,24.6],[51.395,24.6],[51.395,24.6]]],[[[51.395,24.6],[51.395,24.6],[51.395,24.6],[51.395,24.6]]],[[[51.396,24.607],[51.396,24.607],[51.396,24.607],[51.396,24.607]]],[[[51.396,24.601],[51.396,24.601],[51.396,24.601],[51.396,24.601]]],[[[51.397,24.606],[51.397,24.606],[51.397,24.606],[51.397,24.606]]],[[[51.397,24.602],[51.397,24.602],[51.397,24.602],[51.397,24.602]]],[[[51.398,24.603],[51.397,24.603],[51.398,24.603],[51.398,24.603]]],[[[51.4,24.607],[51.4,24.606],[51.401,24.606],[51.4,24.607]]],[[[51.411,24.625],[51.411,24.625],[51.411,24.625],[51.411,24.625]]],[[[51.412,24.628],[51.412,24.626],[51.413,24.628],[51.412,24.628]]],[[[51.413,24.629],[51.413,24.628],[51.414,24.628],[51.413,24.629]]],[[[51.416,24.627],[51.415,24.626],[51.416,24.626],[51.416,24.627]]],[[[51.427,24.628],[51.428,24.628],[51.427,24.629],[51.427,24.628]]],[[[51.43,24.629],[51.43,24.629],[51.43,24.629],[51.43,24.629]]],[[[51.431,24.628],[51.431,24.628],[51.431,24.628],[51.431,24.628]]],[[[51.454,24.604],[51.454,24.603],[51.454,24.603],[51.454,24.604]]]]}}]};
const GEO_RIYADH={"type":"FeatureCollection","features":[{"type":"Feature","properties":{"name":"العمل"},"geometry":{"type":"Polygon","coordinates":[[[46.7332,24.6469],[46.7162,24.6512],[46.7151,24.6466],[46.7178,24.6402],[46.7337,24.6447],[46.7332,24.6469]]]}},{"type":"Feature","properties":{"name":"النموذجية"},"geometry":{"type":"Polygon","coordinates":[[[46.7023,24.6502],[46.7002,24.6637],[46.6958,24.6682],[46.685,24.6609],[46.6924,24.6472],[46.697,24.6462],[46.7023,24.6502]]]}},{"type":"Feature","properties":{"name":"الجرادية"},"geometry":{"type":"Polygon","coordinates":[[[46.7066,24.6173],[46.6995,24.6185],[46.6936,24.6262],[46.6914,24.6265],[46.6956,24.6101],[46.7068,24.6142],[46.7066,24.6173]]]}},{"type":"Feature","properties":{"name":"الصناعية"},"geometry":{"type":"Polygon","coordinates":[[[46.7619,24.6342],[46.7545,24.6541],[46.7388,24.6527],[46.7332,24.6469],[46.7392,24.6302],[46.7619,24.6342]]]}},{"type":"Feature","properties":{"name":"منفوحة الجديدة"},"geometry":{"type":"Polygon","coordinates":[[[46.7283,24.6109],[46.7239,24.6209],[46.7176,24.6205],[46.7212,24.6158],[46.7165,24.6123],[46.7143,24.6189],[46.71,24.617],[46.7108,24.606],[46.7158,24.6059],[46.7268,24.6101],[46.7283,24.6109]]]}},{"type":"Feature","properties":{"name":"الفاخرية"},"geometry":{"type":"Polygon","coordinates":[[[46.6932,24.647],[46.6901,24.6502],[46.6876,24.6466],[46.6724,24.6428],[46.6752,24.6338],[46.6929,24.6414],[46.6932,24.647]]]}},{"type":"Feature","properties":{"name":"الديرة"},"geometry":{"type":"Polygon","coordinates":[[[46.7178,24.6379],[46.7039,24.6377],[46.7058,24.6228],[46.714,24.6279],[46.7122,24.6302],[46.7173,24.63],[46.7178,24.6379]]]}},{"type":"Feature","properties":{"name":"ام الحمام الشرقي"},"geometry":{"type":"Polygon","coordinates":[[[46.6554,24.7019],[46.6495,24.6969],[46.6511,24.6878],[46.6567,24.6751],[46.669,24.6749],[46.6659,24.684],[46.6554,24.7019]]]}},{"type":"Feature","properties":{"name":"الشرفية"},"geometry":{"type":"Polygon","coordinates":[[[46.6787,24.6566],[46.6586,24.6715],[46.6607,24.6662],[46.6643,24.6649],[46.6663,24.6493],[46.6787,24.6566]]]}},{"type":"Feature","properties":{"name":"الهدا"},"geometry":{"type":"Polygon","coordinates":[[[46.6586,24.6715],[46.6347,24.6869],[46.6394,24.6788],[46.6374,24.6727],[46.6197,24.6661],[46.6045,24.6568],[46.6057,24.6547],[46.6091,24.6573],[46.617,24.655],[46.6242,24.6496],[46.6438,24.6409],[46.6461,24.6498],[46.6663,24.6493],[46.6643,24.6649],[46.6607,24.6662],[46.6586,24.6715]]]}},{"type":"Feature","properties":{"name":"المعذر الشمالي"},"geometry":{"type":"Polygon","coordinates":[[[46.6781,24.6754],[46.6781,24.6796],[46.6636,24.7084],[46.6541,24.7044],[46.6659,24.684],[46.669,24.6749],[46.6781,24.6754]]]}},{"type":"Feature","properties":{"name":"ام الحمام الغربي"},"geometry":{"type":"Polygon","coordinates":[[[46.6571,24.6745],[46.6511,24.6878],[46.6495,24.6969],[46.6554,24.7019],[46.6541,24.7044],[46.6298,24.6942],[46.6347,24.6869],[46.6525,24.6755],[46.6571,24.6745]]]}},{"type":"Feature","properties":{"name":"الرحمانية"},"geometry":{"type":"Polygon","coordinates":[[[46.664,24.7278],[46.6469,24.7205],[46.6541,24.7044],[46.672,24.7121],[46.664,24.7278]]]}},{"type":"Feature","properties":{"name":"لبن"},"geometry":{"type":"Polygon","coordinates":[[[46.6176,24.6547],[46.6091,24.6573],[46.606,24.6547],[46.6045,24.6568],[46.5996,24.6537],[46.5769,24.6235],[46.5633,24.6103],[46.5756,24.6114],[46.5719,24.6052],[46.5731,24.6036],[46.5818,24.6124],[46.5866,24.6129],[46.5879,24.6153],[46.5927,24.6172],[46.597,24.6226],[46.6007,24.6207],[46.5994,24.6176],[46.6008,24.6153],[46.6041,24.6189],[46.6033,24.6171],[46.606,24.6175],[46.6055,24.6154],[46.6091,24.6186],[46.6103,24.6158],[46.6125,24.619],[46.6166,24.6183],[46.6228,24.6215],[46.6253,24.6199],[46.6237,24.6196],[46.6268,24.6179],[46.6231,24.6183],[46.6135,24.6147],[46.6176,24.6145],[46.617,24.6128],[46.6098,24.6136],[46.6121,24.6124],[46.6092,24.6116],[46.6099,24.6107],[46.6175,24.6114],[46.6167,24.6096],[46.6122,24.6103],[46.611,24.6076],[46.6122,24.6051],[46.6134,24.609],[46.6145,24.6072],[46.6185,24.6086],[46.6197,24.6146],[46.6215,24.612],[46.6201,24.6082],[46.6236,24.6122],[46.6266,24.6141],[46.6212,24.6061],[46.6286,24.6147],[46.6299,24.6133],[46.6336,24.6189],[46.6331,24.6168],[46.6366,24.6182],[46.6346,24.6149],[46.6377,24.6178],[46.6371,24.6204],[46.6407,24.6207],[46.6406,24.6179],[46.6415,24.6175],[46.6418,24.6232],[46.6398,24.6234],[46.6478,24.6291],[46.6512,24.6359],[46.6389,24.6437],[46.6241,24.6496],[46.6176,24.6547]]]}},{"type":"Feature","properties":{"name":"الرفيعة"},"geometry":{"type":"Polygon","coordinates":[[[46.6766,24.6253],[46.6699,24.6505],[46.6461,24.6498],[46.6438,24.6409],[46.6525,24.635],[46.6672,24.6301],[46.6717,24.6253],[46.6766,24.6253]]]}},{"type":"Feature","properties":{"name":"الشهداء"},"geometry":{"type":"Polygon","coordinates":[[[46.7486,24.7837],[46.7403,24.8002],[46.7223,24.7926],[46.7306,24.7762],[46.7486,24.7837]]]}},{"type":"Feature","properties":{"name":"الملك فهد"},"geometry":{"type":"Polygon","coordinates":[[[46.664,24.7278],[46.6852,24.7367],[46.6767,24.7535],[46.6556,24.7446],[46.664,24.7278]]]}},{"type":"Feature","properties":{"name":"السويدي"},"geometry":{"type":"Polygon","coordinates":[[[46.7031,24.5966],[46.7066,24.6047],[46.681,24.5955],[46.6744,24.6034],[46.671,24.5991],[46.6713,24.6017],[46.6639,24.6008],[46.6528,24.5883],[46.6612,24.5769],[46.6929,24.5965],[46.6958,24.5947],[46.7031,24.5966]]]}},{"type":"Feature","properties":{"name":"الحزم"},"geometry":{"type":"Polygon","coordinates":[[[46.6591,24.5554],[46.6557,24.5598],[46.652,24.5551],[46.6433,24.5509],[46.639,24.546],[46.6269,24.5426],[46.6266,24.54],[46.6219,24.5377],[46.6251,24.5356],[46.6257,24.5268],[46.6451,24.517],[46.6511,24.5278],[46.6706,24.5516],[46.6591,24.5554]]]}},{"type":"Feature","properties":{"name":"عتيقة"},"geometry":{"type":"Polygon","coordinates":[[[46.7092,24.6169],[46.7066,24.6173],[46.7069,24.6058],[46.7031,24.5977],[46.7053,24.5861],[46.7068,24.5859],[46.7118,24.5901],[46.7092,24.6169]]]}},{"type":"Feature","properties":{"name":"المربع"},"geometry":{"type":"Polygon","coordinates":[[[46.71,24.6671],[46.708,24.6814],[46.6958,24.6682],[46.7003,24.6635],[46.703,24.6448],[46.7152,24.6469],[46.7182,24.667],[46.71,24.6671]]]}},{"type":"Feature","properties":{"name":"الفلاح"},"geometry":{"type":"Polygon","coordinates":[[[46.7223,24.7926],[46.7142,24.809],[46.6961,24.8014],[46.7044,24.785],[46.7223,24.7926]]]}},{"type":"Feature","properties":{"name":"الندى"},"geometry":{"type":"Polygon","coordinates":[[[46.6961,24.8014],[46.6878,24.8178],[46.6698,24.8103],[46.6781,24.7939],[46.6961,24.8014]]]}},{"type":"Feature","properties":{"name":"المرسلات"},"geometry":{"type":"Polygon","coordinates":[[[46.6852,24.7367],[46.7031,24.7442],[46.6947,24.761],[46.6767,24.7535],[46.6852,24.7367]]]}},{"type":"Feature","properties":{"name":"النزهة"},"geometry":{"type":"Polygon","coordinates":[[[46.7211,24.7519],[46.7127,24.7686],[46.6947,24.761],[46.7031,24.7442],[46.7211,24.7519]]]}},{"type":"Feature","properties":{"name":"الورود"},"geometry":{"type":"Polygon","coordinates":[[[46.6929,24.7214],[46.6852,24.7367],[46.664,24.7278],[46.672,24.7121],[46.6929,24.7214]]]}},{"type":"Feature","properties":{"name":"الملك فيصل"},"geometry":{"type":"Polygon","coordinates":[[[46.7902,24.7568],[46.7765,24.7763],[46.7591,24.7677],[46.7745,24.747],[46.7902,24.7568]]]}},{"type":"Feature","properties":{"name":"المدينة الصناعية الثانية"},"geometry":{"type":"Polygon","coordinates":[[[46.8692,24.5859],[46.8497,24.5588],[46.9355,24.5027],[46.9444,24.5117],[46.9466,24.5182],[46.945,24.525],[46.9369,24.5356],[46.9271,24.5448],[46.882,24.5738],[46.8692,24.5859]]]}},{"type":"Feature","properties":{"name":"العزيزية"},"geometry":{"type":"Polygon","coordinates":[[[46.8088,24.5874],[46.7654,24.6124],[46.7583,24.606],[46.7373,24.5943],[46.7581,24.5614],[46.8044,24.5837],[46.8088,24.5874]]]}},{"type":"Feature","properties":{"name":"المنصورة"},"geometry":{"type":"Polygon","coordinates":[[[46.7654,24.6124],[46.7474,24.622],[46.7283,24.6109],[46.7373,24.5943],[46.7608,24.6078],[46.7654,24.6124]]]}},{"type":"Feature","properties":{"name":"غبيرة"},"geometry":{"type":"Polygon","coordinates":[[[46.7283,24.6109],[46.7474,24.622],[46.742,24.6241],[46.7392,24.6302],[46.7337,24.6291],[46.7354,24.6211],[46.7254,24.6176],[46.7283,24.6109]]]}},{"type":"Feature","properties":{"name":"الفاروق"},"geometry":{"type":"Polygon","coordinates":[[[46.792,24.6535],[46.7846,24.6669],[46.7545,24.6541],[46.76,24.6406],[46.792,24.6535]]]}},{"type":"Feature","properties":{"name":"الفيصلية"},"geometry":{"type":"Polygon","coordinates":[[[46.8034,24.6304],[46.792,24.6535],[46.76,24.6406],[46.7675,24.6152],[46.7716,24.6207],[46.7774,24.6245],[46.8034,24.6304]]]}},{"type":"Feature","properties":{"name":"الخالدية"},"geometry":{"type":"Polygon","coordinates":[[[46.7675,24.6152],[46.7619,24.6342],[46.7392,24.6302],[46.7423,24.6239],[46.758,24.615],[46.7654,24.6124],[46.7675,24.6152]]]}},{"type":"Feature","properties":{"name":"الجزيرة"},"geometry":{"type":"Polygon","coordinates":[[[46.8153,24.6518],[46.796,24.6861],[46.7776,24.6796],[46.7971,24.6433],[46.8153,24.6518]]]}},{"type":"Feature","properties":{"name":"السعادة"},"geometry":{"type":"Polygon","coordinates":[[[46.827,24.6776],[46.8565,24.6912],[46.8553,24.7176],[46.8277,24.7004],[46.8167,24.6959],[46.827,24.6776]]]}},{"type":"Feature","properties":{"name":"الناصرية"},"geometry":{"type":"Polygon","coordinates":[[[46.6901,24.6502],[46.685,24.6609],[46.6699,24.6505],[46.6724,24.6428],[46.6876,24.6466],[46.6901,24.6502]]]}},{"type":"Feature","properties":{"name":"المناخ"},"geometry":{"type":"Polygon","coordinates":[[[46.8379,24.6028],[46.8104,24.6187],[46.8034,24.6304],[46.7764,24.624],[46.7705,24.6197],[46.7654,24.6124],[46.8088,24.5874],[46.822,24.5939],[46.8214,24.5984],[46.8483,24.5928],[46.8379,24.6028]]]}},{"type":"Feature","properties":{"name":"الدفاع"},"geometry":{"type":"Polygon","coordinates":[[[46.8483,24.5928],[46.8214,24.5984],[46.822,24.5939],[46.8088,24.5874],[46.8265,24.5736],[46.8333,24.5819],[46.8466,24.5794],[46.8539,24.5826],[46.856,24.5891],[46.8483,24.5928]]]}},{"type":"Feature","properties":{"name":"النور"},"geometry":{"type":"Polygon","coordinates":[[[46.835,24.6169],[46.8153,24.6518],[46.7971,24.6433],[46.8111,24.6181],[46.8241,24.6117],[46.835,24.6169]]]}},{"type":"Feature","properties":{"name":"الملك عبدالله"},"geometry":{"type":"Polygon","coordinates":[[[46.7617,24.7145],[46.7388,24.7598],[46.7211,24.7519],[46.7258,24.7426],[46.7262,24.7454],[46.7297,24.7461],[46.7285,24.7482],[46.7337,24.7496],[46.732,24.7379],[46.7361,24.7398],[46.7412,24.7376],[46.7377,24.7344],[46.7363,24.7288],[46.7419,24.7288],[46.739,24.7247],[46.7431,24.715],[46.7462,24.7125],[46.7466,24.705],[46.7617,24.7145]]]}},{"type":"Feature","properties":{"name":"الواحة"},"geometry":{"type":"Polygon","coordinates":[[[46.7258,24.7426],[46.7211,24.7519],[46.7031,24.7442],[46.7089,24.7329],[46.7111,24.7368],[46.7237,24.729],[46.7258,24.7426]]]}},{"type":"Feature","properties":{"name":"صلاح الدين"},"geometry":{"type":"Polygon","coordinates":[[[46.7089,24.7329],[46.7031,24.7442],[46.6852,24.7367],[46.6929,24.7213],[46.6943,24.7219],[46.6935,24.7256],[46.6989,24.7266],[46.7047,24.7238],[46.7089,24.7329]]]}},{"type":"Feature","properties":{"name":"الملك عبدالعزيز"},"geometry":{"type":"Polygon","coordinates":[[[46.7321,24.7378],[46.7337,24.7496],[46.7285,24.7482],[46.7297,24.7461],[46.7262,24.7454],[46.7237,24.729],[46.7111,24.7368],[46.7047,24.7238],[46.6989,24.7266],[46.6929,24.7244],[46.6943,24.7186],[46.6986,24.7137],[46.7179,24.7064],[46.718,24.6924],[46.7317,24.6954],[46.7466,24.705],[46.7462,24.7125],[46.7431,24.715],[46.739,24.7247],[46.7419,24.7288],[46.7363,24.7288],[46.7377,24.7344],[46.7412,24.7376],[46.7361,24.7398],[46.7321,24.7378]]]}},{"type":"Feature","properties":{"name":"الوزارات"},"geometry":{"type":"Polygon","coordinates":[[[46.7183,24.6681],[46.7185,24.6711],[46.718,24.6924],[46.708,24.6814],[46.7104,24.6659],[46.7183,24.6681]]]}},{"type":"Feature","properties":{"name":"سكيرينة"},"geometry":{"type":"Polygon","coordinates":[[[46.7165,24.6123],[46.7212,24.6158],[46.7176,24.6205],[46.7143,24.6189],[46.7165,24.6123]]]}},{"type":"Feature","properties":{"name":"الربوة"},"geometry":{"type":"Polygon","coordinates":[[[46.7735,24.6947],[46.7617,24.7145],[46.7315,24.6953],[46.7334,24.6867],[46.7409,24.6818],[46.7543,24.6883],[46.7604,24.673],[46.7776,24.6796],[46.7735,24.6947]]]}},{"type":"Feature","properties":{"name":"جرير"},"geometry":{"type":"Polygon","coordinates":[[[46.7604,24.673],[46.7543,24.6883],[46.7409,24.6818],[46.7483,24.6661],[46.751,24.6695],[46.7604,24.673]]]}},{"type":"Feature","properties":{"name":"المعذر"},"geometry":{"type":"Polygon","coordinates":[[[46.6781,24.6754],[46.6525,24.6755],[46.6787,24.6566],[46.685,24.6609],[46.6781,24.6754]]]}},{"type":"Feature","properties":{"name":"الصالحية"},"geometry":{"type":"Polygon","coordinates":[[[46.7392,24.6302],[46.7366,24.6397],[46.7288,24.6357],[46.7337,24.6291],[46.7392,24.6302]]]}},{"type":"Feature","properties":{"name":"الملز"},"geometry":{"type":"Polygon","coordinates":[[[46.7545,24.6541],[46.7409,24.6818],[46.7265,24.6788],[46.7291,24.6671],[46.7182,24.667],[46.7162,24.6512],[46.7332,24.6469],[46.7388,24.6527],[46.7545,24.6541]]]}},{"type":"Feature","properties":{"name":"منفوحة"},"geometry":{"type":"Polygon","coordinates":[[[46.7367,24.595],[46.7283,24.6109],[46.7195,24.6072],[46.725,24.588],[46.7367,24.595]]]}},{"type":"Feature","properties":{"name":"عليشة"},"geometry":{"type":"Polygon","coordinates":[[[46.6914,24.6265],[46.6929,24.6414],[46.6752,24.6338],[46.6766,24.6253],[46.6914,24.6265]]]}},{"type":"Feature","properties":{"name":"النهضة"},"geometry":{"type":"Polygon","coordinates":[[[46.8413,24.7648],[46.8295,24.7811],[46.7902,24.7568],[46.8027,24.74],[46.8413,24.7648]]]}},{"type":"Feature","properties":{"name":"الخليج"},"geometry":{"type":"Polygon","coordinates":[[[46.8295,24.7811],[46.8181,24.7968],[46.7911,24.7802],[46.7765,24.7763],[46.7902,24.7568],[46.8295,24.7811]]]}},{"type":"Feature","properties":{"name":"الضباط"},"geometry":{"type":"Polygon","coordinates":[[[46.7291,24.6671],[46.7232,24.6936],[46.718,24.6924],[46.7182,24.667],[46.7291,24.6671]]]}},{"type":"Feature","properties":{"name":"السويدي الغربي"},"geometry":{"type":"Polygon","coordinates":[[[46.6444,24.5611],[46.6243,24.5886],[46.605,24.5768],[46.6094,24.573],[46.635,24.5612],[46.6444,24.5611]]]}},{"type":"Feature","properties":{"name":"ديراب"},"geometry":{"type":"Polygon","coordinates":[[[46.6246,24.5366],[46.622,24.5378],[46.6171,24.5348],[46.6122,24.5301],[46.6108,24.5255],[46.6062,24.5222],[46.6026,24.5211],[46.6048,24.5231],[46.605,24.5268],[46.6002,24.5246],[46.5998,24.52],[46.5961,24.5144],[46.597,24.5115],[46.5934,24.5082],[46.6161,24.4961],[46.6123,24.4884],[46.6212,24.4841],[46.6378,24.51],[46.6451,24.517],[46.6257,24.5268],[46.6246,24.5366]]]}},{"type":"Feature","properties":{"name":"احد"},"geometry":{"type":"Polygon","coordinates":[[[46.6523,24.4896],[46.6508,24.4905],[46.6553,24.4976],[46.6363,24.5077],[46.6147,24.474],[46.6293,24.4726],[46.6323,24.4793],[46.635,24.4799],[46.6355,24.4844],[46.6412,24.4847],[46.643,24.488],[46.6483,24.4862],[46.6523,24.4896]]]}},{"type":"Feature","properties":{"name":"نمار"},"geometry":{"type":"Polygon","coordinates":[[[46.7053,24.5861],[46.6913,24.5849],[46.6706,24.5713],[46.6521,24.5656],[46.6591,24.5554],[46.6706,24.5516],[46.7025,24.5797],[46.7053,24.5861]]]}},{"type":"Feature","properties":{"name":"الشفا"},"geometry":{"type":"Polygon","coordinates":[[[46.7109,24.5851],[46.7053,24.5861],[46.7025,24.5797],[46.6747,24.5564],[46.6927,24.544],[46.711,24.5662],[46.7224,24.5717],[46.7143,24.5792],[46.7109,24.5851]]]}},{"type":"Feature","properties":{"name":"المحمدية"},"geometry":{"type":"Polygon","coordinates":[[[46.6469,24.7205],[46.664,24.7278],[46.6556,24.7445],[46.6337,24.7353],[46.6427,24.7276],[46.6469,24.7205]]]}},{"type":"Feature","properties":{"name":"السليمانية"},"geometry":{"type":"Polygon","coordinates":[[[46.718,24.6924],[46.7179,24.7064],[46.6991,24.7134],[46.6929,24.7213],[46.6819,24.7165],[46.6873,24.7063],[46.6904,24.7076],[46.6962,24.6934],[46.7033,24.6969],[46.6989,24.6854],[46.7034,24.6755],[46.718,24.6924]]]}},{"type":"Feature","properties":{"name":"المروة"},"geometry":{"type":"Polygon","coordinates":[[[46.6927,24.544],[46.6747,24.5564],[46.6588,24.5373],[46.6775,24.5252],[46.6927,24.544]]]}},{"type":"Feature","properties":{"name":"عكاظ"},"geometry":{"type":"Polygon","coordinates":[[[46.6763,24.5253],[46.6588,24.5373],[46.6451,24.517],[46.6363,24.5077],[46.6553,24.4976],[46.6508,24.4905],[46.6528,24.4891],[46.6582,24.4904],[46.6642,24.4955],[46.67,24.4952],[46.6713,24.4935],[46.6774,24.4973],[46.6826,24.4953],[46.6829,24.5003],[46.6935,24.497],[46.684,24.5043],[46.6922,24.5142],[46.6824,24.521],[46.6841,24.5222],[46.683,24.5247],[46.6763,24.5253]]]}},{"type":"Feature","properties":{"name":"شبرا"},"geometry":{"type":"Polygon","coordinates":[[[46.6945,24.5955],[46.6929,24.5965],[46.6416,24.5649],[46.6444,24.5611],[46.655,24.567],[46.6719,24.572],[46.6875,24.5828],[46.6854,24.5857],[46.6945,24.5955]]]}},{"type":"Feature","properties":{"name":"الزهرة"},"geometry":{"type":"Polygon","coordinates":[[[46.6612,24.5769],[46.6498,24.5924],[46.6303,24.5804],[46.6416,24.5649],[46.6612,24.5769]]]}},{"type":"Feature","properties":{"name":"صياح"},"geometry":{"type":"Polygon","coordinates":[[[46.7066,24.6047],[46.7068,24.6142],[46.6956,24.6101],[46.6995,24.6019],[46.7066,24.6047]]]}},{"type":"Feature","properties":{"name":"سلطانة"},"geometry":{"type":"Polygon","coordinates":[[[46.6995,24.6019],[46.6928,24.6172],[46.6867,24.6138],[46.6846,24.6109],[46.6856,24.6097],[46.6824,24.607],[46.6744,24.6034],[46.681,24.5955],[46.6919,24.5988],[46.6995,24.6019]]]}},{"type":"Feature","properties":{"name":"اليمامة"},"geometry":{"type":"Polygon","coordinates":[[[46.725,24.588],[46.7195,24.6072],[46.7108,24.606],[46.7118,24.59],[46.7068,24.5859],[46.7139,24.5852],[46.725,24.588]]]}},{"type":"Feature","properties":{"name":"البديعة"},"geometry":{"type":"Polygon","coordinates":[[[46.6914,24.6261],[46.6717,24.6253],[46.673,24.6207],[46.669,24.6156],[46.6729,24.6082],[46.6796,24.6059],[46.6856,24.6097],[46.6846,24.6109],[46.6866,24.6137],[46.6928,24.6172],[46.6914,24.6261]]]}},{"type":"Feature","properties":{"name":"المصانع"},"geometry":{"type":"Polygon","coordinates":[[[46.7731,24.5356],[46.7373,24.5943],[46.7237,24.5875],[46.7109,24.5851],[46.7143,24.5792],[46.7321,24.5606],[46.7369,24.5522],[46.7461,24.5492],[46.7605,24.5326],[46.7628,24.5164],[46.7673,24.513],[46.7773,24.5105],[46.7731,24.5356]]]}},{"type":"Feature","properties":{"name":"القادسية"},"geometry":{"type":"Polygon","coordinates":[[[46.846,24.8185],[46.8501,24.8394],[46.8157,24.8311],[46.7978,24.8245],[46.8157,24.8],[46.8357,24.8144],[46.846,24.8185]]]}},{"type":"Feature","properties":{"name":"الصفا"},"geometry":{"type":"Polygon","coordinates":[[[46.7846,24.6669],[46.7776,24.6796],[46.7511,24.6696],[46.7483,24.6661],[46.7545,24.6541],[46.7846,24.6669]]]}},{"type":"Feature","properties":{"name":"العليا"},"geometry":{"type":"Polygon","coordinates":[[[46.6873,24.7063],[46.6819,24.7165],[46.6636,24.7084],[46.6781,24.6796],[46.6781,24.6754],[46.6888,24.6788],[46.6958,24.6682],[46.7034,24.6755],[46.6989,24.6854],[46.7033,24.6969],[46.6962,24.6934],[46.6904,24.7076],[46.6873,24.7063]]]}},{"type":"Feature","properties":{"name":"الدريهمية"},"geometry":{"type":"Polygon","coordinates":[[[46.7031,24.5961],[46.6945,24.5955],[46.6854,24.5857],[46.6875,24.5828],[46.6934,24.5855],[46.7053,24.5861],[46.7031,24.5961]]]}},{"type":"Feature","properties":{"name":"الاسكان"},"geometry":{"type":"Polygon","coordinates":[[[46.8689,24.5861],[46.856,24.5891],[46.8545,24.5833],[46.8517,24.581],[46.8429,24.5795],[46.8333,24.5819],[46.8265,24.5736],[46.8497,24.5588],[46.8689,24.5861]]]}},{"type":"Feature","properties":{"name":"السلام"},"geometry":{"type":"Polygon","coordinates":[[[46.8277,24.7004],[46.8112,24.7227],[46.7947,24.7126],[46.8096,24.6928],[46.8277,24.7004]]]}},{"type":"Feature","properties":{"name":"المنار"},"geometry":{"type":"Polygon","coordinates":[[[46.8112,24.7227],[46.7998,24.7381],[46.7833,24.7279],[46.7947,24.7126],[46.8112,24.7227]]]}},{"type":"Feature","properties":{"name":"النسيم الشرقي"},"geometry":{"type":"Polygon","coordinates":[[[46.8567,24.7443],[46.8413,24.7648],[46.8203,24.7509],[46.8482,24.7132],[46.8698,24.7266],[46.8662,24.7362],[46.8567,24.7443]]]}},{"type":"Feature","properties":{"name":"القدس"},"geometry":{"type":"Polygon","coordinates":[[[46.77,24.7532],[46.7591,24.7677],[46.7388,24.7598],[46.7488,24.74],[46.77,24.7532]]]}},{"type":"Feature","properties":{"name":"الوادي"},"geometry":{"type":"Polygon","coordinates":[[[46.6864,24.7775],[46.7044,24.785],[46.6961,24.8014],[46.6781,24.7939],[46.6864,24.7775]]]}},{"type":"Feature","properties":{"name":"النفل"},"geometry":{"type":"Polygon","coordinates":[[[46.6684,24.7699],[46.6864,24.7775],[46.6781,24.7939],[46.6602,24.7863],[46.6684,24.7699]]]}},{"type":"Feature","properties":{"name":"المصيف"},"geometry":{"type":"Polygon","coordinates":[[[46.6947,24.761],[46.6864,24.7775],[46.6684,24.7699],[46.6767,24.7535],[46.6947,24.761]]]}},{"type":"Feature","properties":{"name":"التعاون"},"geometry":{"type":"Polygon","coordinates":[[[46.7127,24.7686],[46.7044,24.785],[46.6864,24.7775],[46.6947,24.761],[46.7127,24.7686]]]}},{"type":"Feature","properties":{"name":"الازدهار"},"geometry":{"type":"Polygon","coordinates":[[[46.7306,24.7762],[46.7223,24.7926],[46.7044,24.785],[46.7127,24.7686],[46.7306,24.7762]]]}},{"type":"Feature","properties":{"name":"الاندلس"},"geometry":{"type":"Polygon","coordinates":[[[46.8027,24.74],[46.7902,24.7568],[46.7745,24.747],[46.787,24.7302],[46.8027,24.74]]]}},{"type":"Feature","properties":{"name":"الروضة"},"geometry":{"type":"Polygon","coordinates":[[[46.787,24.7302],[46.77,24.7532],[46.7488,24.74],[46.7617,24.7145],[46.787,24.7302]]]}},{"type":"Feature","properties":{"name":"الروابي"},"geometry":{"type":"Polygon","coordinates":[[[46.8096,24.6928],[46.7947,24.7126],[46.7783,24.7023],[46.7819,24.6975],[46.7735,24.6947],[46.7776,24.6796],[46.7933,24.6848],[46.8096,24.6928]]]}},{"type":"Feature","properties":{"name":"الريان"},"geometry":{"type":"Polygon","coordinates":[[[46.7947,24.7126],[46.7833,24.7279],[46.7617,24.7145],[46.7735,24.6947],[46.7819,24.6975],[46.7783,24.7023],[46.7947,24.7126]]]}},{"type":"Feature","properties":{"name":"ظهرة البديعة"},"geometry":{"type":"Polygon","coordinates":[[[46.6751,24.6065],[46.6695,24.6138],[46.6652,24.6134],[46.6438,24.6006],[46.6422,24.6027],[46.6227,24.5908],[46.6303,24.5804],[46.6498,24.5924],[46.6528,24.5883],[46.6639,24.6008],[46.6713,24.6017],[46.671,24.5991],[46.6749,24.6039],[46.6792,24.6059],[46.6751,24.6065]]]}},{"type":"Feature","properties":{"name":"النظيم"},"geometry":{"type":"Polygon","coordinates":[[[46.9056,24.7731],[46.9395,24.7769],[46.9494,24.799],[46.9662,24.812],[46.9753,24.8145],[46.973,24.8228],[46.9788,24.8363],[47.0031,24.8486],[47.0208,24.8655],[47.0435,24.8708],[47.0554,24.8805],[47.0623,24.8799],[47.0535,24.9221],[47.0411,24.9531],[47.0215,24.9458],[47.002,24.9443],[47.0,24.9428],[46.9805,24.9095],[46.9466,24.8765],[46.8955,24.8372],[46.8727,24.8068],[46.8892,24.7967],[46.906,24.7747],[46.9056,24.7731]]]}},{"type":"Feature","properties":{"name":"الرماية"},"geometry":{"type":"Polygon","coordinates":[[[46.8893,24.7965],[46.8783,24.7817],[46.8616,24.7918],[46.8413,24.7648],[46.8567,24.7443],[46.8678,24.7507],[46.89,24.7508],[46.89,24.7633],[46.9051,24.7635],[46.906,24.7747],[46.8893,24.7965]]]}},{"type":"Feature","properties":{"name":"البرية"},"geometry":{"type":"Polygon","coordinates":[[[46.9134,24.5964],[46.8954,24.5953],[46.8696,24.5891],[46.8692,24.5859],[46.882,24.5738],[46.933,24.5399],[46.9447,24.5256],[46.9465,24.5176],[46.9519,24.5179],[46.9592,24.499],[46.9897,24.5113],[46.9944,24.51],[46.9915,24.5059],[46.9875,24.5044],[46.988,24.4999],[46.9909,24.4982],[46.9985,24.5088],[46.9992,24.5135],[46.9967,24.5144],[46.9954,24.5234],[46.9917,24.5266],[46.9915,24.5314],[46.986,24.5363],[46.9869,24.5385],[46.99,24.5393],[46.9898,24.543],[47.0034,24.5535],[47.0067,24.5583],[47.0051,24.5774],[47.0069,24.5836],[47.0002,24.5862],[46.9949,24.5861],[46.9937,24.5891],[46.9913,24.5899],[46.9895,24.5872],[46.9917,24.5857],[46.9882,24.5843],[46.9934,24.5841],[46.9928,24.5822],[46.9896,24.5818],[46.991,24.5809],[46.988,24.5792],[46.9848,24.5832],[46.9847,24.5816],[46.9785,24.5829],[46.9789,24.5816],[46.9742,24.5806],[46.9838,24.5794],[46.9835,24.5765],[46.9861,24.5765],[46.984,24.5754],[46.9795,24.5793],[46.972,24.5787],[46.9649,24.5816],[46.9588,24.5805],[46.9541,24.5868],[46.954,24.594],[46.9134,24.5964]]]}},{"type":"Feature","properties":{"name":"طيبة"},"geometry":{"type":"Polygon","coordinates":[[[46.8652,24.5488],[46.8265,24.5736],[46.8219,24.5677],[46.7959,24.5552],[46.8072,24.5354],[46.8339,24.5099],[46.8652,24.5488]]]}},{"type":"Feature","properties":{"name":"المنصورية"},"geometry":{"type":"Polygon","coordinates":[[[46.8339,24.5099],[46.8072,24.5354],[46.7959,24.5552],[46.7691,24.5425],[46.7737,24.534],[46.7773,24.5105],[46.8006,24.4824],[46.8045,24.4875],[46.826,24.5006],[46.8339,24.5099]]]}},{"type":"Feature","properties":{"name":"ضاحية نمار"},"geometry":{"type":"Polygon","coordinates":[[[46.5486,24.5442],[46.5413,24.5505],[46.5412,24.5471],[46.5349,24.5495],[46.5307,24.5473],[46.5366,24.5452],[46.5257,24.5456],[46.5252,24.5439],[46.5279,24.5424],[46.5253,24.5411],[46.5177,24.5401],[46.511,24.5424],[46.5177,24.5373],[46.5114,24.5389],[46.5111,24.5405],[46.5089,24.5383],[46.5084,24.5401],[46.5069,24.5394],[46.5075,24.5412],[46.5046,24.5417],[46.5041,24.5445],[46.494,24.549],[46.4934,24.547],[46.4959,24.545],[46.4872,24.5466],[46.4881,24.5444],[46.4954,24.5418],[46.4953,24.5412],[46.4841,24.5447],[46.4887,24.5422],[46.4838,24.5417],[46.486,24.5401],[46.4851,24.5393],[46.4823,24.5412],[46.4809,24.5401],[46.4822,24.5388],[46.4792,24.5384],[46.4839,24.5361],[46.4872,24.5368],[46.4878,24.5348],[46.4951,24.5363],[46.489,24.5329],[46.48,24.5367],[46.4755,24.5407],[46.4681,24.5412],[46.4657,24.5403],[46.4747,24.5363],[46.4669,24.5331],[46.4607,24.5341],[46.4574,24.5328],[46.4696,24.5319],[46.463,24.5298],[46.4644,24.5288],[46.4613,24.5269],[46.4522,24.5287],[46.4456,24.5245],[46.4419,24.5285],[46.4345,24.5246],[46.4263,24.5234],[46.4129,24.527],[46.4264,24.519],[46.4275,24.5154],[46.4315,24.5177],[46.4316,24.5152],[46.4355,24.5143],[46.4346,24.511],[46.4457,24.5103],[46.4478,24.5055],[46.4493,24.5068],[46.4531,24.5026],[46.456,24.5028],[46.4559,24.5004],[46.4575,24.5017],[46.4611,24.4997],[46.4625,24.4962],[46.4654,24.4973],[46.4666,24.4956],[46.4654,24.4932],[46.4674,24.4952],[46.468,24.4923],[46.471,24.4941],[46.4753,24.4895],[46.4702,24.489],[46.4722,24.4865],[46.4772,24.4853],[46.4753,24.479],[46.4797,24.4805],[46.4879,24.4723],[46.4879,24.4761],[46.4981,24.474],[46.4985,24.4764],[46.5019,24.4768],[46.5022,24.4794],[46.5056,24.4786],[46.5051,24.4807],[46.5074,24.4802],[46.5077,24.4829],[46.5103,24.4827],[46.5165,24.4764],[46.515,24.4685],[46.52,24.4631],[46.5185,24.4587],[46.5152,24.4565],[46.523,24.4586],[46.5294,24.4562],[46.5248,24.4616],[46.5254,24.4678],[46.5285,24.4645],[46.5332,24.4642],[46.5345,24.4611],[46.5354,24.4639],[46.5375,24.464],[46.5437,24.4612],[46.5461,24.4622],[46.5508,24.4591],[46.5494,24.4619],[46.5555,24.461],[46.5345,24.466],[46.5304,24.4701],[46.5495,24.4695],[46.5481,24.4699],[46.5491,24.471],[46.5394,24.47],[46.531,24.473],[46.533,24.4737],[46.5321,24.4751],[46.5382,24.4739],[46.5345,24.4767],[46.5347,24.4771],[46.5471,24.4798],[46.5559,24.4756],[46.5614,24.4712],[46.5631,24.4675],[46.5697,24.4643],[46.5764,24.4561],[46.5821,24.4533],[46.5829,24.4493],[46.581,24.4457],[46.5831,24.4472],[46.5874,24.4454],[46.5868,24.4476],[46.5887,24.448],[46.5968,24.4445],[46.5919,24.4482],[46.5939,24.4506],[46.5929,24.453],[46.5953,24.4531],[46.6006,24.4506],[46.6033,24.4455],[46.6037,24.45],[46.6059,24.4495],[46.6086,24.4415],[46.6107,24.4409],[46.6103,24.4459],[46.6176,24.4445],[46.6105,24.4651],[46.6212,24.4841],[46.6123,24.4884],[46.6161,24.4961],[46.5934,24.5082],[46.597,24.5115],[46.5961,24.5144],[46.5998,24.52],[46.5999,24.5242],[46.605,24.5268],[46.6048,24.5231],[46.6026,24.5211],[46.6062,24.5222],[46.6108,24.5255],[46.6122,24.5301],[46.6171,24.5348],[46.6266,24.54],[46.627,24.5433],[46.6242,24.5487],[46.6211,24.5495],[46.6138,24.5472],[46.609,24.5499],[46.6098,24.5467],[46.6044,24.5496],[46.6011,24.5488],[46.6042,24.5472],[46.6042,24.5449],[46.5998,24.5479],[46.5892,24.5493],[46.5868,24.5513],[46.5897,24.5478],[46.5886,24.5467],[46.5904,24.5468],[46.588,24.5442],[46.586,24.5479],[46.5788,24.5505],[46.5845,24.5458],[46.5777,24.5451],[46.5814,24.5436],[46.574,24.54],[46.5651,24.5453],[46.5598,24.5443],[46.552,24.5484],[46.5529,24.5475],[46.5486,24.5442]]]}},{"type":"Feature","properties":{"name":"المصفاة"},"geometry":{"type":"Polygon","coordinates":[[[46.9355,24.5027],[46.8652,24.5488],[46.8436,24.5207],[46.8212,24.497],[46.9075,24.473],[46.9461,24.4244],[46.9781,24.4102],[46.981,24.4203],[46.9866,24.4227],[46.9953,24.4345],[46.9975,24.4326],[47.0046,24.4389],[46.9355,24.5027]],[[46.9797,24.4368],[46.9721,24.44],[46.9785,24.4462],[46.9835,24.4418],[46.9797,24.4368]]]}},{"type":"Feature","properties":{"name":"السفارات"},"geometry":{"type":"Polygon","coordinates":[[[46.6268,24.6967],[46.6194,24.693],[46.6186,24.6963],[46.6076,24.6811],[46.6072,24.6717],[46.6037,24.661],[46.6045,24.6568],[46.6188,24.6656],[46.635,24.6711],[46.6386,24.6743],[46.6386,24.681],[46.6268,24.6967]],[[46.6235,24.7035],[46.6278,24.6972],[46.6232,24.7039],[46.6235,24.7035]]]}},{"type":"Feature","properties":{"name":"خشم العان"},"geometry":{"type":"Polygon","coordinates":[[[46.9037,24.7225],[46.9146,24.7325],[46.9169,24.7428],[46.9215,24.7474],[46.9148,24.7555],[46.9094,24.7569],[46.9051,24.7635],[46.89,24.7633],[46.89,24.7508],[46.8678,24.7507],[46.8567,24.7443],[46.8662,24.7362],[46.8698,24.7266],[46.8553,24.7176],[46.8574,24.6546],[46.8993,24.6555],[46.8969,24.6459],[46.9014,24.6356],[46.9056,24.6103],[46.9134,24.5964],[46.9539,24.594],[46.9537,24.6097],[46.9523,24.6091],[46.9519,24.612],[46.9504,24.6111],[46.9501,24.6132],[46.9478,24.6131],[46.9418,24.6229],[46.9455,24.6362],[46.9525,24.6431],[46.9586,24.6633],[46.9569,24.6637],[46.96,24.6683],[46.9579,24.6731],[46.9592,24.6795],[46.9554,24.6911],[46.9537,24.6913],[46.9487,24.7003],[46.9415,24.7056],[46.9299,24.7066],[46.928,24.7088],[46.9239,24.7094],[46.921,24.715],[46.9164,24.7187],[46.909,24.7197],[46.8957,24.7174],[46.8998,24.7233],[46.9037,24.7225]]]}},{"type":"Feature","properties":{"name":"قرطبة"},"geometry":{"type":"Polygon","coordinates":[[[46.758,24.8077],[46.7416,24.8401],[46.7219,24.8302],[46.7137,24.8142],[46.7143,24.8088],[46.7223,24.7926],[46.758,24.8077]]]}},{"type":"Feature","properties":{"name":"طويق"},"geometry":{"type":"Polygon","coordinates":[[[46.5756,24.6114],[46.561,24.6113],[46.556,24.6054],[46.545,24.6006],[46.5418,24.5955],[46.5361,24.5916],[46.5303,24.5896],[46.5278,24.5914],[46.5279,24.5879],[46.5226,24.5861],[46.5198,24.5818],[46.5152,24.5817],[46.515,24.5761],[46.5074,24.5715],[46.5066,24.5772],[46.4942,24.5566],[46.4828,24.5581],[46.4825,24.5594],[46.4888,24.5626],[46.4865,24.5625],[46.4859,24.5642],[46.4814,24.5641],[46.4722,24.5571],[46.4702,24.5572],[46.4712,24.5607],[46.4618,24.5608],[46.4583,24.5584],[46.4562,24.5524],[46.4463,24.5473],[46.4469,24.5442],[46.4437,24.5457],[46.4429,24.5421],[46.4398,24.5427],[46.4395,24.5396],[46.4433,24.5367],[46.438,24.5356],[46.4388,24.5327],[46.4456,24.5245],[46.4522,24.5287],[46.4613,24.5269],[46.4644,24.5288],[46.463,24.5298],[46.4696,24.5319],[46.4574,24.5328],[46.4669,24.5331],[46.4747,24.5363],[46.4657,24.5403],[46.4689,24.5412],[46.4755,24.5407],[46.48,24.5367],[46.489,24.5329],[46.4951,24.5363],[46.4878,24.5348],[46.4872,24.5368],[46.4839,24.5361],[46.4792,24.5384],[46.4822,24.5388],[46.4809,24.5401],[46.4823,24.5412],[46.4851,24.5393],[46.486,24.5401],[46.4838,24.5417],[46.4887,24.5422],[46.4841,24.5447],[46.4953,24.5412],[46.4881,24.5444],[46.4872,24.5466],[46.4959,24.545],[46.4934,24.547],[46.494,24.549],[46.5041,24.5445],[46.5046,24.5417],[46.5075,24.5412],[46.5069,24.5394],[46.5084,24.5401],[46.5089,24.5383],[46.5111,24.5405],[46.5114,24.5389],[46.5177,24.5373],[46.511,24.5424],[46.5177,24.5401],[46.5253,24.5411],[46.5279,24.5424],[46.5253,24.5454],[46.5366,24.5452],[46.5307,24.5475],[46.5349,24.5495],[46.5412,24.5471],[46.5413,24.5505],[46.5486,24.5442],[46.5527,24.5484],[46.5598,24.5443],[46.5626,24.5455],[46.5694,24.544],[46.574,24.54],[46.5814,24.5436],[46.5777,24.5451],[46.5845,24.5458],[46.5787,24.5495],[46.5788,24.5505],[46.586,24.5479],[46.588,24.5442],[46.5904,24.5468],[46.5886,24.5467],[46.5897,24.5478],[46.5868,24.5513],[46.5893,24.5492],[46.5802,24.5613],[46.5802,24.5735],[46.5955,24.5729],[46.5719,24.6052],[46.5756,24.6114]]]}},{"type":"Feature","properties":{"name":"العوالي"},"geometry":{"type":"Polygon","coordinates":[[[46.605,24.5768],[46.5945,24.5727],[46.5802,24.5735],[46.5806,24.5599],[46.5893,24.5492],[46.5993,24.5481],[46.6044,24.5449],[46.6042,24.5472],[46.601,24.5487],[46.6044,24.5496],[46.6098,24.5467],[46.609,24.5499],[46.6139,24.5472],[46.6227,24.5495],[46.6272,24.5426],[46.639,24.546],[46.6433,24.5509],[46.652,24.5551],[46.6557,24.5598],[46.6521,24.5656],[46.6433,24.5607],[46.6358,24.5609],[46.6094,24.573],[46.605,24.5768]]]}},{"type":"Feature","properties":{"name":"الربيع"},"geometry":{"type":"Polygon","coordinates":[[[46.6781,24.7939],[46.6698,24.8103],[46.6529,24.8031],[46.6432,24.7791],[46.6781,24.7939]]]}},{"type":"Feature","properties":{"name":"المغرزات"},"geometry":{"type":"Polygon","coordinates":[[[46.7388,24.7598],[46.7306,24.7762],[46.7127,24.7686],[46.7211,24.7519],[46.7388,24.7598]]]}},{"type":"Feature","properties":{"name":"السلي"},"geometry":{"type":"Polygon","coordinates":[[[46.8574,24.6551],[46.8565,24.6912],[46.8062,24.6679],[46.835,24.6169],[46.8969,24.6459],[46.8993,24.6555],[46.8574,24.6551]]]}},{"type":"Feature","properties":{"name":"العقيق"},"geometry":{"type":"Polygon","coordinates":[[[46.6293,24.7534],[46.6472,24.761],[46.6307,24.7938],[46.6127,24.7862],[46.6293,24.7534]]]}},{"type":"Feature","properties":{"name":"النخيل"},"geometry":{"type":"Polygon","coordinates":[[[46.6556,24.7446],[46.6472,24.761],[46.5904,24.7363],[46.5941,24.7306],[46.6021,24.7238],[46.6222,24.7441],[46.6337,24.7353],[46.6556,24.7446]]]}},{"type":"Feature","properties":{"name":"الغدير"},"geometry":{"type":"Polygon","coordinates":[[[46.6684,24.7699],[46.6602,24.7863],[46.6432,24.7791],[46.6408,24.7737],[46.6472,24.761],[46.6684,24.7699]]]}},{"type":"Feature","properties":{"name":"المروج"},"geometry":{"type":"Polygon","coordinates":[[[46.6767,24.7535],[46.6684,24.7699],[46.6472,24.761],[46.6556,24.7446],[46.6767,24.7535]]]}},{"type":"Feature","properties":{"name":"العود"},"geometry":{"type":"Polygon","coordinates":[[[46.7173,24.63],[46.7254,24.6176],[46.7354,24.6211],[46.7347,24.6273],[46.7288,24.6357],[46.7173,24.63]]]}},{"type":"Feature","properties":{"name":"ثليم"},"geometry":{"type":"Polygon","coordinates":[[[46.7364,24.6407],[46.7337,24.6447],[46.7182,24.6404],[46.7178,24.6379],[46.7364,24.6407]]]}},{"type":"Feature","properties":{"name":"الشميسي"},"geometry":{"type":"Polygon","coordinates":[[[46.7066,24.6173],[46.7047,24.631],[46.6923,24.6298],[46.6924,24.627],[46.6997,24.6184],[46.7066,24.6173]]]}},{"type":"Feature","properties":{"name":"الوشام"},"geometry":{"type":"Polygon","coordinates":[[[46.7023,24.6498],[46.697,24.6462],[46.6932,24.647],[46.6927,24.637],[46.7039,24.6377],[46.7023,24.6498]]]}},{"type":"Feature","properties":{"name":"منتزه سلام"},"geometry":{"type":"Polygon","coordinates":[[[46.7066,24.6173],[46.71,24.617],[46.7112,24.6263],[46.7058,24.6228],[46.7066,24.6173]]]}},{"type":"Feature","properties":{"name":"الدوبية"},"geometry":{"type":"Polygon","coordinates":[[[46.7102,24.617],[46.7143,24.6189],[46.7119,24.6266],[46.7112,24.6263],[46.7102,24.617]]]}},{"type":"Feature","properties":{"name":"معكال"},"geometry":{"type":"Polygon","coordinates":[[[46.7145,24.619],[46.7176,24.6205],[46.7128,24.6271],[46.7119,24.6266],[46.7145,24.619]]]}},{"type":"Feature","properties":{"name":"جبرة"},"geometry":{"type":"Polygon","coordinates":[[[46.717,24.6298],[46.7173,24.6281],[46.7148,24.6269],[46.7179,24.6222],[46.721,24.6232],[46.7239,24.6209],[46.717,24.6298]]]}},{"type":"Feature","properties":{"name":"القرى"},"geometry":{"type":"Polygon","coordinates":[[[46.714,24.6279],[46.7173,24.6281],[46.7163,24.6294],[46.714,24.6279]]]}},{"type":"Feature","properties":{"name":"المرقب"},"geometry":{"type":"Polygon","coordinates":[[[46.7366,24.6397],[46.7178,24.6379],[46.7168,24.6308],[46.7173,24.63],[46.7366,24.6397]]]}},{"type":"Feature","properties":{"name":"الفوطة"},"geometry":{"type":"Polygon","coordinates":[[[46.7155,24.6457],[46.703,24.6448],[46.7039,24.6377],[46.7178,24.6379],[46.7155,24.6457]]]}},{"type":"Feature","properties":{"name":"ام سليم"},"geometry":{"type":"Polygon","coordinates":[[[46.7047,24.631],[46.7039,24.6377],[46.6927,24.637],[46.6923,24.6298],[46.7047,24.631]]]}},{"type":"Feature","properties":{"name":"الصحافة"},"geometry":{"type":"Polygon","coordinates":[[[46.6529,24.8006],[46.6436,24.8191],[46.6224,24.8102],[46.6408,24.7737],[46.6529,24.8006]]]}},{"type":"Feature","properties":{"name":"الرائد"},"geometry":{"type":"Polygon","coordinates":[[[46.6541,24.7044],[46.6469,24.7205],[46.6343,24.7148],[46.6232,24.7039],[46.6298,24.6942],[46.6541,24.7044]]]}},{"type":"Feature","properties":{"name":"العريجاء الغربي"},"geometry":{"type":"Polygon","coordinates":[[[46.6008,24.6153],[46.6007,24.6207],[46.597,24.6226],[46.5927,24.6172],[46.5879,24.6153],[46.5866,24.6129],[46.5818,24.6124],[46.5731,24.6036],[46.5955,24.5729],[46.6025,24.5753],[46.6243,24.5886],[46.611,24.6072],[46.6122,24.6103],[46.6167,24.6096],[46.6175,24.6114],[46.6092,24.6116],[46.6121,24.6124],[46.6094,24.613],[46.6109,24.6138],[46.617,24.6128],[46.6176,24.6145],[46.6135,24.6147],[46.6231,24.6183],[46.6268,24.6179],[46.6262,24.619],[46.6228,24.6215],[46.6166,24.6183],[46.6125,24.619],[46.6106,24.6158],[46.6091,24.6186],[46.6055,24.6154],[46.606,24.6175],[46.6033,24.6171],[46.6048,24.6187],[46.6008,24.6153]]]}},{"type":"Feature","properties":{"name":"العريجاء"},"geometry":{"type":"Polygon","coordinates":[[[46.6717,24.6253],[46.667,24.6302],[46.6512,24.6359],[46.6478,24.6291],[46.6397,24.6232],[46.6418,24.6232],[46.6415,24.6176],[46.6568,24.6185],[46.6607,24.6207],[46.6626,24.6182],[46.663,24.6199],[46.6648,24.6185],[46.6654,24.6199],[46.669,24.6159],[46.673,24.6207],[46.6717,24.6253]]]}},{"type":"Feature","properties":{"name":"العريجاء الوسطى"},"geometry":{"type":"Polygon","coordinates":[[[46.6415,24.6176],[46.6407,24.6207],[46.6371,24.6204],[46.6377,24.6178],[46.6346,24.6149],[46.6366,24.6182],[46.6331,24.6168],[46.6336,24.6189],[46.6299,24.6133],[46.6286,24.6147],[46.6212,24.6061],[46.6266,24.6141],[46.6201,24.6082],[46.6215,24.612],[46.6197,24.6146],[46.6185,24.6086],[46.6145,24.6072],[46.6134,24.609],[46.6122,24.6051],[46.6227,24.5908],[46.6422,24.6027],[46.6438,24.6006],[46.664,24.6129],[46.6695,24.6138],[46.6654,24.6199],[46.6648,24.6185],[46.663,24.6199],[46.6626,24.6182],[46.6607,24.6207],[46.6568,24.6185],[46.6415,24.6176]]]}},{"type":"Feature","properties":{"name":"الحمراء"},"geometry":{"type":"Polygon","coordinates":[[[46.7765,24.7763],[46.7663,24.7912],[46.7306,24.7762],[46.7388,24.7598],[46.7765,24.7763]]]}},{"type":"Feature","properties":{"name":"الدار البيضاء"},"geometry":{"type":"Polygon","coordinates":[[[46.8265,24.5736],[46.8088,24.5874],[46.8044,24.5837],[46.7581,24.5614],[46.7691,24.5425],[46.8218,24.5676],[46.8265,24.5736]]]}},{"type":"Feature","properties":{"name":"البطيحا"},"geometry":{"type":"Polygon","coordinates":[[[46.7188,24.6206],[46.7224,24.6208],[46.721,24.6232],[46.7179,24.6222],[46.7188,24.6206]]]}},{"type":"Feature","properties":{"name":"الزهراء"},"geometry":{"type":"Polygon","coordinates":[[[46.7409,24.6818],[46.7334,24.6867],[46.7315,24.6953],[46.7232,24.6936],[46.7265,24.6788],[46.7409,24.6818]]]}},{"type":"Feature","properties":{"name":"الفيحاء"},"geometry":{"type":"Polygon","coordinates":[[[46.827,24.6776],[46.8167,24.6959],[46.796,24.6861],[46.8062,24.6679],[46.827,24.6776]]]}},{"type":"Feature","properties":{"name":"المؤتمرات"},"geometry":{"type":"Polygon","coordinates":[[[46.6958,24.6682],[46.6888,24.6788],[46.6781,24.6754],[46.685,24.6609],[46.6958,24.6682]]]}},{"type":"Feature","properties":{"name":"الوسيطاء"},"geometry":{"type":"Polygon","coordinates":[[[46.713,24.6267],[46.7188,24.6206],[46.714,24.6279],[46.713,24.6267]]]}},{"type":"Feature","properties":{"name":"الجنادرية"},"geometry":{"type":"Polygon","coordinates":[[[47.0023,24.9443],[46.9941,24.945],[46.9872,24.9446],[46.9735,24.9402],[46.956,24.9264],[46.9398,24.9196],[46.9037,24.895],[46.8889,24.8893],[46.8804,24.8819],[46.871,24.8605],[46.8501,24.8394],[46.8462,24.8234],[46.8471,24.8148],[46.8593,24.7948],[46.8581,24.7872],[46.8955,24.8372],[46.9466,24.8765],[46.9805,24.9095],[46.9912,24.9264],[46.9964,24.9387],[47.0023,24.9443]]]}},{"type":"Feature","properties":{"name":"اشبيلية"},"geometry":{"type":"Polygon","coordinates":[[[46.8181,24.7968],[46.8089,24.8093],[46.7663,24.7912],[46.7765,24.7763],[46.7932,24.7814],[46.8181,24.7968]]]}},{"type":"Feature","properties":{"name":"المعيزلة"},"geometry":{"type":"Polygon","coordinates":[[[46.8587,24.7962],[46.846,24.8185],[46.8357,24.8144],[46.8157,24.8],[46.8413,24.7648],[46.8597,24.7909],[46.8587,24.7962]]]}},{"type":"Feature","properties":{"name":"اليرموك"},"geometry":{"type":"Polygon","coordinates":[[[46.7663,24.7912],[46.8089,24.8093],[46.7978,24.8245],[46.758,24.8077],[46.7663,24.7912]]]}},{"type":"Feature","properties":{"name":"المونسية"},"geometry":{"type":"Polygon","coordinates":[[[46.7939,24.8228],[46.7762,24.8577],[46.7416,24.8401],[46.758,24.8077],[46.7939,24.8228]]]}},{"type":"Feature","properties":{"name":"الخزامى"},"geometry":{"type":"Polygon","coordinates":[[[46.5991,24.7263],[46.5928,24.7254],[46.5912,24.7098],[46.6004,24.7083],[46.6042,24.7026],[46.6164,24.6934],[46.6186,24.6963],[46.6194,24.693],[46.6278,24.6972],[46.6184,24.7104],[46.5991,24.7263]]]}},{"type":"Feature","properties":{"name":"عرقة"},"geometry":{"type":"Polygon","coordinates":[[[46.6059,24.7011],[46.5983,24.7092],[46.5914,24.7098],[46.5816,24.7065],[46.5773,24.7069],[46.5611,24.691],[46.5579,24.6844],[46.5573,24.6772],[46.5629,24.6774],[46.5669,24.6806],[46.573,24.679],[46.5748,24.6761],[46.5847,24.6704],[46.5962,24.6754],[46.6072,24.6723],[46.6074,24.6806],[46.6173,24.6934],[46.6059,24.7011]]]}},{"type":"Feature","properties":{"name":"ظهرة لبن"},"geometry":{"type":"Polygon","coordinates":[[[46.5682,24.6582],[46.5714,24.6633],[46.5623,24.6607],[46.5586,24.657],[46.5528,24.656],[46.5498,24.651],[46.5401,24.6431],[46.5343,24.6423],[46.5306,24.6378],[46.5273,24.6374],[46.5276,24.6336],[46.5204,24.6279],[46.5185,24.6295],[46.5125,24.6257],[46.5087,24.6257],[46.5061,24.6283],[46.5037,24.6275],[46.4916,24.6176],[46.493,24.6157],[46.4852,24.6109],[46.4782,24.6103],[46.4777,24.6117],[46.4825,24.6118],[46.4817,24.613],[46.4765,24.6129],[46.4681,24.6095],[46.4699,24.6113],[46.4676,24.6106],[46.4679,24.6125],[46.4615,24.6097],[46.4607,24.6114],[46.4586,24.6083],[46.4568,24.6085],[46.4563,24.6055],[46.4641,24.6026],[46.4637,24.6049],[46.4713,24.6028],[46.4777,24.604],[46.4847,24.6029],[46.4857,24.6068],[46.4919,24.6071],[46.4964,24.6052],[46.5002,24.6083],[46.5041,24.6051],[46.5009,24.6028],[46.5069,24.602],[46.5102,24.5991],[46.5159,24.5977],[46.5157,24.6009],[46.5177,24.599],[46.5231,24.6031],[46.5334,24.6016],[46.5345,24.6029],[46.5326,24.6052],[46.535,24.6066],[46.5343,24.6084],[46.5412,24.609],[46.5332,24.6106],[46.5338,24.6126],[46.5411,24.6126],[46.5433,24.6148],[46.5508,24.6141],[46.5534,24.6156],[46.5517,24.6173],[46.5558,24.6194],[46.5705,24.617],[46.5967,24.6508],[46.6045,24.6568],[46.5989,24.6582],[46.5931,24.6559],[46.5911,24.6572],[46.5936,24.66],[46.5876,24.6593],[46.5884,24.6605],[46.5862,24.661],[46.5837,24.6596],[46.5831,24.6618],[46.5736,24.6612],[46.5682,24.6582]]]}},{"type":"Feature","properties":{"name":"حطين"},"geometry":{"type":"Polygon","coordinates":[[[46.6293,24.7534],[46.6127,24.7862],[46.5927,24.7778],[46.583,24.7788],[46.5725,24.7749],[46.5904,24.7363],[46.6293,24.7534]]]}},{"type":"Feature","properties":{"name":"الملقا"},"geometry":{"type":"Polygon","coordinates":[[[46.6307,24.7938],[46.6141,24.8266],[46.5833,24.8132],[46.5732,24.7996],[46.5648,24.7968],[46.5725,24.7749],[46.583,24.7788],[46.5929,24.7779],[46.6307,24.7938]]]}},{"type":"Feature","properties":{"name":"القيروان"},"geometry":{"type":"Polygon","coordinates":[[[46.5648,24.7968],[46.5735,24.7999],[46.5838,24.8136],[46.6141,24.8266],[46.5515,24.9501],[46.5334,24.9405],[46.5265,24.9334],[46.5021,24.9198],[46.4964,24.9136],[46.5233,24.899],[46.5464,24.8686],[46.5519,24.8553],[46.5552,24.826],[46.5648,24.7968]]]}},{"type":"Feature","properties":{"name":"الياسمين"},"geometry":{"type":"Polygon","coordinates":[[[46.6698,24.8103],[46.6533,24.8431],[46.6141,24.8266],[46.6224,24.8102],[46.6436,24.8191],[46.6519,24.8027],[46.6698,24.8103]]]}},{"type":"Feature","properties":{"name":"العارض"},"geometry":{"type":"Polygon","coordinates":[[[46.6533,24.8431],[46.5892,24.97],[46.5703,24.9618],[46.5515,24.9501],[46.6141,24.8266],[46.6533,24.8431]]]}},{"type":"Feature","properties":{"name":"مطار الملك خالد"},"geometry":{"type":"Polygon","coordinates":[[[46.697,24.9405],[46.6965,24.9391],[46.6976,24.9399],[46.697,24.9405]],[[46.6947,24.9403],[46.6928,24.9434],[46.6945,24.9445],[46.6968,24.9412],[46.6947,24.9403]],[[46.7216,24.944],[46.7196,24.944],[46.7216,24.945],[46.7216,24.944]],[[46.7191,24.9448],[46.7172,24.9479],[46.7189,24.949],[46.7212,24.9457],[46.7191,24.9448]],[[46.6923,24.9442],[46.6903,24.9477],[46.6912,24.9497],[46.6942,24.9452],[46.6923,24.9442]],[[46.6896,24.9482],[46.6887,24.9497],[46.69,24.9493],[46.6896,24.9482]],[[46.7166,24.9487],[46.7133,24.9541],[46.7134,24.9545],[46.7159,24.9538],[46.7187,24.9497],[46.7166,24.9487]],[[46.691,24.9505],[46.6872,24.9524],[46.6878,24.9548],[46.691,24.9505]],[[46.6863,24.9535],[46.6854,24.955],[46.6867,24.9546],[46.6863,24.9535]],[[46.7146,24.9563],[46.7155,24.9547],[46.7143,24.9551],[46.7146,24.9563]],[[46.6919,24.9571],[46.6951,24.9525],[46.6915,24.9506],[46.6886,24.9553],[46.6919,24.9571]],[[46.7112,24.9541],[46.7075,24.958],[46.7079,24.9585],[46.7112,24.9541]],[[46.7122,24.9547],[46.7089,24.9588],[46.7091,24.9591],[46.7122,24.9547]],[[46.7128,24.9549],[46.71,24.9593],[46.71,24.9595],[46.7134,24.9581],[46.7128,24.9549]],[[46.6876,24.9557],[46.6839,24.9577],[46.6845,24.9601],[46.6876,24.9557]],[[46.683,24.9587],[46.6821,24.9602],[46.6834,24.9598],[46.683,24.9587]],[[46.7113,24.9615],[46.7122,24.96],[46.7109,24.9604],[46.7113,24.9615]],[[46.7128,24.9604],[46.7118,24.9619],[46.7131,24.9615],[46.7128,24.9604]],[[46.7193,24.9501],[46.7135,24.9598],[46.7177,24.9635],[46.7248,24.9529],[46.7193,24.9501]],[[46.7079,24.9593],[46.7042,24.9633],[46.7045,24.9638],[46.7079,24.9593]],[[46.7089,24.9599],[46.7056,24.964],[46.7058,24.9643],[46.7089,24.9599]],[[46.7094,24.9601],[46.7066,24.9645],[46.7067,24.9648],[46.71,24.9633],[46.7094,24.9601]],[[46.7212,24.9652],[46.7241,24.9607],[46.7214,24.9592],[46.7185,24.9639],[46.7212,24.9652]],[[46.6844,24.9609],[46.6812,24.9616],[46.679,24.9655],[46.681,24.9662],[46.6844,24.9609]],[[46.708,24.9668],[46.7089,24.9653],[46.7076,24.9657],[46.708,24.9668]],[[46.7036,24.9613],[46.7077,24.9524],[46.7099,24.9532],[46.695,24.9454],[46.692,24.9501],[46.6954,24.9519],[46.6963,24.9538],[46.6987,24.9506],[46.6998,24.9517],[46.6978,24.9548],[46.6951,24.9553],[46.6958,24.9579],[46.6937,24.9612],[46.6921,24.9608],[46.694,24.9573],[46.6918,24.9576],[46.6884,24.9559],[46.6854,24.9603],[46.7002,24.9683],[46.6986,24.9671],[46.7036,24.9613]],[[46.7046,24.9646],[46.701,24.9685],[46.7015,24.969],[46.7046,24.9646]],[[46.7056,24.9652],[46.7023,24.9691],[46.7024,24.9696],[46.7056,24.9652]],[[46.6784,24.9661],[46.6764,24.9693],[46.6782,24.9704],[46.6804,24.9671],[46.6784,24.9661]],[[46.7062,24.9653],[46.7034,24.9698],[46.7051,24.9709],[46.7073,24.9673],[46.7062,24.9653]],[[46.678,24.9709],[46.676,24.971],[46.6776,24.9717],[46.678,24.9709]],[[46.7173,24.9641],[46.7117,24.9626],[46.706,24.9715],[46.7113,24.9741],[46.7173,24.9641]],[[46.7028,24.9706],[46.7008,24.9738],[46.7026,24.9749],[46.7048,24.9716],[46.7028,24.9706]],[[46.7004,24.9693],[46.6976,24.9739],[46.6992,24.9749],[46.7024,24.9702],[46.7004,24.9693]],[[46.7007,24.9745],[46.701,24.9759],[46.7023,24.9756],[46.7007,24.9745]],[[46.6671,25.0039],[46.6726,24.9949],[46.6749,24.9984],[46.7018,25.0008],[46.7167,24.9852],[46.7226,24.9816],[46.7291,24.9821],[46.7318,24.9781],[46.7382,24.9751],[46.7453,24.9684],[46.8047,24.8723],[46.7209,24.8308],[46.7012,24.8194],[46.5953,24.9913],[46.6031,24.9975],[46.6055,25.0016],[46.6114,25.0042],[46.6104,25.0124],[46.6671,25.0039]],[[46.6927,24.9787],[46.694,24.9796],[46.6974,24.9747],[46.7041,24.978],[46.7029,24.9759],[46.7056,24.9719],[46.7109,24.9755],[46.7181,24.9645],[46.7293,24.9707],[46.7216,24.9656],[46.7249,24.962],[46.7252,24.9599],[46.7216,24.9586],[46.7258,24.9519],[46.7199,24.9493],[46.7224,24.9452],[46.7248,24.9451],[46.7236,24.9433],[46.7202,24.9428],[46.7189,24.9437],[46.715,24.9414],[46.7141,24.9427],[46.7187,24.9444],[46.7123,24.9539],[46.6953,24.945],[46.6988,24.939],[46.6958,24.937],[46.6739,24.9717],[46.6775,24.9722],[46.6802,24.9699],[46.6852,24.9611],[46.6999,24.9689],[46.6927,24.9787]]]}},{"type":"Feature","properties":{"name":"النرجس"},"geometry":{"type":"Polygon","coordinates":[[[46.7012,24.8194],[46.6027,24.9793],[46.5892,24.97],[46.6698,24.8103],[46.6907,24.8189],[46.7012,24.8194]]]}},{"type":"Feature","properties":{"name":"جامعة الامام محمد بن سعود الاسلامية"},"geometry":{"type":"Polygon","coordinates":[[[46.7219,24.8302],[46.7007,24.8191],[46.6878,24.8178],[46.6961,24.8014],[46.7142,24.809],[46.7143,24.8166],[46.7219,24.8302]]]}},{"type":"Feature","properties":{"name":"بنبان"},"geometry":{"type":"Polygon","coordinates":[[[46.5071,25.0561],[46.4859,25.0461],[46.4727,25.0366],[46.4678,25.031],[46.4797,25.0133],[46.4741,25.0127],[46.4667,25.0061],[46.4714,24.9934],[46.4704,24.9559],[46.4727,24.9262],[46.4781,24.9189],[46.4964,24.9136],[46.5021,24.9198],[46.5265,24.9334],[46.5334,24.9405],[46.5703,24.9618],[46.5918,24.9712],[46.6027,24.9793],[46.5953,24.9913],[46.6116,25.0057],[46.6104,25.0124],[46.6043,25.0244],[46.599,25.0226],[46.5937,25.0255],[46.5904,25.0391],[46.5867,25.0431],[46.5726,25.0325],[46.5645,25.0387],[46.5639,25.0417],[46.5538,25.0404],[46.5512,25.042],[46.5447,25.0393],[46.5417,25.0407],[46.5374,25.0393],[46.522,25.0439],[46.5147,25.0484],[46.5154,25.053],[46.5071,25.0561]]]}},{"type":"Feature","properties":{"name":"الرمال"},"geometry":{"type":"Polygon","coordinates":[[[46.7047,25.0871],[46.6913,25.105],[46.6789,25.0951],[46.6814,25.0949],[46.7077,25.066],[46.7125,25.0604],[46.7129,25.057],[46.6991,25.0447],[46.6901,25.0397],[46.6803,25.0383],[46.6812,25.0054],[46.6675,25.0019],[46.6677,24.9999],[46.6726,24.9949],[46.6749,24.9984],[46.7018,25.0008],[46.7167,24.9852],[46.7226,24.9816],[46.7291,24.9821],[46.7318,24.9781],[46.7382,24.9751],[46.7461,24.9675],[46.8047,24.8723],[46.7762,24.8577],[46.7939,24.8228],[46.8149,24.8309],[46.8501,24.8394],[46.8507,24.8528],[46.8388,24.9106],[46.8317,24.9216],[46.7892,24.9594],[46.7822,24.9689],[46.7619,25.0287],[46.7555,25.0381],[46.7466,25.0453],[46.7538,25.0544],[46.742,25.0893],[46.744,25.0912],[46.7343,25.1039],[46.7047,25.0871]]]}},{"type":"Feature","properties":{"name":"غرناطة"},"geometry":{"type":"Polygon","coordinates":[[[46.7486,24.7837],[46.7663,24.7912],[46.758,24.8077],[46.7403,24.8002],[46.7486,24.7837]]]}},{"type":"Feature","properties":{"name":"الدحو"},"geometry":{"type":"Polygon","coordinates":[[[46.714,24.6279],[46.7157,24.6312],[46.7121,24.63],[46.714,24.6279]]]}},{"type":"Feature","properties":{"name":"العماجية"},"geometry":{"type":"Polygon","coordinates":[[[46.9805,24.4376],[46.9835,24.4418],[46.9785,24.4462],[46.9721,24.44],[46.9805,24.4376]]]}},{"type":"Feature","properties":{"name":"هيت"},"geometry":{"type":"Polygon","coordinates":[[[46.9966,24.4974],[46.988,24.4999],[46.9875,24.5044],[46.9915,24.5059],[46.9944,24.51],[46.9897,24.5113],[46.9592,24.499],[46.9519,24.5179],[46.9465,24.5176],[46.9442,24.5114],[46.9355,24.5027],[47.0046,24.4389],[47.0244,24.4546],[47.0129,24.4603],[47.0085,24.4657],[47.0095,24.4677],[47.0062,24.4665],[47.0035,24.4738],[47.0052,24.474],[47.0058,24.4773],[47.0014,24.4779],[47.0003,24.4804],[47.0032,24.4904],[46.9977,24.4897],[46.996,24.4918],[46.9999,24.4937],[46.996,24.4929],[46.9966,24.4974]]]}},{"type":"Feature","properties":{"name":"الحائر"},"geometry":{"type":"Polygon","coordinates":[[[46.9079,24.4727],[46.8522,24.4878],[46.841,24.4797],[46.8078,24.4689],[46.8141,24.4594],[46.798,24.4551],[46.809,24.4412],[46.82,24.4377],[46.8236,24.4343],[46.8233,24.4315],[46.8152,24.4273],[46.812,24.4219],[46.8184,24.4139],[46.8271,24.4118],[46.8309,24.4076],[46.8307,24.4021],[46.8239,24.392],[46.825,24.3868],[46.8286,24.3839],[46.8296,24.3776],[46.83,24.3824],[46.8355,24.3834],[46.8469,24.3833],[46.8469,24.3815],[46.8501,24.3832],[46.8511,24.3816],[46.8521,24.3831],[46.861,24.3842],[46.8614,24.3829],[46.8625,24.3847],[46.8692,24.3858],[46.8739,24.3856],[46.8736,24.3838],[46.8753,24.3855],[46.8783,24.3848],[46.8778,24.3834],[46.8794,24.3846],[46.8862,24.3831],[46.8879,24.3823],[46.8871,24.3809],[46.8911,24.3815],[46.8994,24.3773],[46.8982,24.3762],[46.9002,24.3737],[46.9011,24.3756],[46.9041,24.374],[46.9075,24.3603],[46.9151,24.3532],[46.9371,24.346],[46.9419,24.3423],[46.9504,24.3528],[46.9494,24.359],[46.955,24.3711],[46.9542,24.3892],[46.9563,24.401],[46.9647,24.4055],[46.9784,24.4025],[46.9781,24.4103],[46.9461,24.4244],[46.9079,24.4727]],[[46.8744,24.451],[46.8841,24.454],[46.8865,24.4476],[46.8768,24.4446],[46.8744,24.451]]]}},{"type":"Feature","properties":{"name":"ام الشعال"},"geometry":{"type":"Polygon","coordinates":[[[46.9784,24.4025],[46.9647,24.4055],[46.9563,24.401],[46.9542,24.3892],[46.955,24.3711],[46.9494,24.359],[46.9504,24.3528],[46.9415,24.3416],[46.9445,24.3373],[46.9457,24.3308],[46.9567,24.3223],[46.9612,24.3264],[46.9637,24.3261],[46.969,24.3401],[46.9694,24.3746],[46.9784,24.4025]]]}},{"type":"Feature","properties":{"name":"الغنامية"},"geometry":{"type":"Polygon","coordinates":[[[46.8212,24.497],[46.8045,24.4875],[46.8012,24.4827],[46.7987,24.4837],[46.7918,24.4747],[46.79,24.4662],[46.798,24.4551],[46.8141,24.4594],[46.8078,24.4689],[46.841,24.4797],[46.8522,24.4878],[46.8212,24.497]]]}},{"type":"Feature","properties":{"name":"عريض"},"geometry":{"type":"Polygon","coordinates":[[[46.7843,24.5027],[46.7811,24.4967],[46.7743,24.4947],[46.7665,24.5001],[46.7622,24.4997],[46.7568,24.4951],[46.746,24.4946],[46.7332,24.4994],[46.7276,24.4978],[46.7206,24.5024],[46.7175,24.5019],[46.7169,24.4971],[46.7133,24.4978],[46.7084,24.4955],[46.706,24.5013],[46.7021,24.4983],[46.6928,24.4968],[46.6828,24.5003],[46.6826,24.4953],[46.6774,24.4973],[46.6713,24.4935],[46.67,24.4952],[46.6642,24.4955],[46.6582,24.4904],[46.6551,24.4907],[46.6484,24.4862],[46.643,24.488],[46.6412,24.4847],[46.6356,24.4845],[46.635,24.4799],[46.6323,24.4793],[46.6293,24.4726],[46.6147,24.474],[46.6108,24.4665],[46.6107,24.4615],[46.6163,24.4466],[46.6219,24.4393],[46.6222,24.4345],[46.6252,24.4331],[46.6297,24.4323],[46.6359,24.4357],[46.6458,24.4347],[46.653,24.4273],[46.66,24.4323],[46.6794,24.4298],[46.6832,24.4278],[46.6916,24.4143],[46.7019,24.4126],[46.7188,24.4153],[46.7195,24.4067],[46.7222,24.4065],[46.7221,24.4101],[46.7431,24.4124],[46.7435,24.4102],[46.7409,24.408],[46.7462,24.4102],[46.7469,24.4061],[46.7493,24.4043],[46.7461,24.4007],[46.7394,24.3977],[46.7411,24.3975],[46.7391,24.3934],[46.7403,24.3924],[46.7437,24.3969],[46.752,24.401],[46.7539,24.3977],[46.7515,24.3967],[46.7497,24.3953],[46.7523,24.3966],[46.7557,24.3948],[46.7543,24.3922],[46.7517,24.3919],[46.7535,24.3915],[46.7576,24.3928],[46.7571,24.3909],[46.7614,24.3883],[46.7612,24.3837],[46.7627,24.3845],[46.7633,24.3827],[46.7657,24.3859],[46.7744,24.3863],[46.7751,24.3844],[46.7766,24.3867],[46.7818,24.3879],[46.7827,24.3858],[46.7849,24.3891],[46.787,24.3885],[46.7858,24.3871],[46.7873,24.3883],[46.7875,24.3897],[46.7884,24.3902],[46.7921,24.3897],[46.7923,24.3914],[46.8016,24.3949],[46.8097,24.3956],[46.8169,24.3882],[46.8128,24.3863],[46.8189,24.3876],[46.8208,24.385],[46.8265,24.3835],[46.8271,24.377],[46.8262,24.3766],[46.8253,24.3775],[46.8226,24.3771],[46.8259,24.3762],[46.8286,24.3767],[46.8286,24.3839],[46.825,24.3868],[46.8239,24.392],[46.8307,24.4021],[46.8309,24.4076],[46.8271,24.4118],[46.8184,24.4139],[46.812,24.4219],[46.8152,24.4273],[46.8233,24.4315],[46.8236,24.4342],[46.82,24.4377],[46.8079,24.4422],[46.7904,24.4652],[46.7918,24.4746],[46.7993,24.484],[46.7843,24.5027]]]}},{"type":"Feature","properties":{"name":"بدر"},"geometry":{"type":"Polygon","coordinates":[[[46.7227,24.5709],[46.7109,24.566],[46.6775,24.5252],[46.683,24.5247],[46.6841,24.5222],[46.6824,24.521],[46.6922,24.5142],[46.684,24.5043],[46.6935,24.497],[46.702,24.4983],[46.7063,24.5012],[46.7082,24.4955],[46.7133,24.4978],[46.717,24.4971],[46.7185,24.5024],[46.7276,24.4978],[46.7332,24.4994],[46.7455,24.4946],[46.7569,24.4952],[46.7633,24.5001],[46.7681,24.4996],[46.7737,24.4947],[46.7811,24.4967],[46.7839,24.5033],[46.7773,24.5105],[46.7673,24.513],[46.7628,24.5164],[46.7605,24.5326],[46.7461,24.5492],[46.737,24.5521],[46.7227,24.5709]]]}},{"type":"Feature","properties":{"name":"المهدية"},"geometry":{"type":"Polygon","coordinates":[[[46.5712,24.6719],[46.5698,24.676],[46.5591,24.6724],[46.551,24.6725],[46.5536,24.674],[46.5517,24.6748],[46.5469,24.6712],[46.5406,24.6699],[46.5409,24.6713],[46.537,24.6712],[46.5325,24.6666],[46.5281,24.6658],[46.5303,24.669],[46.527,24.6677],[46.5269,24.6693],[46.5234,24.6691],[46.5201,24.6653],[46.5197,24.6698],[46.5225,24.6708],[46.5206,24.6723],[46.5177,24.669],[46.5115,24.6679],[46.508,24.6623],[46.5026,24.6589],[46.5083,24.6685],[46.5061,24.6672],[46.5014,24.6593],[46.499,24.6589],[46.4976,24.6562],[46.4971,24.6586],[46.4946,24.6544],[46.4916,24.6527],[46.4942,24.6577],[46.505,24.6666],[46.503,24.6653],[46.5013,24.6682],[46.4989,24.6685],[46.4916,24.6616],[46.4928,24.6595],[46.4865,24.6517],[46.4823,24.65],[46.475,24.6409],[46.4731,24.6408],[46.4731,24.643],[46.47,24.6399],[46.4714,24.6374],[46.4691,24.6361],[46.4704,24.6359],[46.4701,24.6323],[46.4678,24.6312],[46.4671,24.6245],[46.4689,24.62],[46.474,24.6187],[46.4703,24.6222],[46.4715,24.6232],[46.4842,24.6209],[46.4886,24.6256],[46.4957,24.6288],[46.4793,24.625],[46.4777,24.6254],[46.486,24.627],[46.4817,24.6288],[46.4878,24.6294],[46.4774,24.6316],[46.4907,24.6314],[46.5032,24.6356],[46.5045,24.6345],[46.5115,24.6325],[46.5106,24.6346],[46.514,24.6346],[46.5119,24.6365],[46.5127,24.6388],[46.5071,24.6376],[46.51,24.6395],[46.5051,24.6397],[46.5145,24.6413],[46.5188,24.64],[46.5186,24.642],[46.5218,24.642],[46.5218,24.6423],[46.5162,24.6429],[46.5252,24.643],[46.53,24.6455],[46.5251,24.6446],[46.5231,24.6447],[46.5223,24.6451],[46.5322,24.6481],[46.5273,24.6473],[46.5235,24.6482],[46.5294,24.6483],[46.5271,24.649],[46.5426,24.6527],[46.545,24.6552],[46.5416,24.6539],[46.5437,24.6554],[46.5396,24.6545],[46.5405,24.6556],[46.5375,24.6564],[46.5384,24.657],[46.5481,24.657],[46.5536,24.662],[46.5572,24.6602],[46.5581,24.6629],[46.5636,24.6648],[46.5652,24.6664],[46.5609,24.6651],[46.5594,24.6709],[46.569,24.6699],[46.5763,24.6655],[46.5822,24.6661],[46.604,24.6625],[46.6058,24.6684],[46.5979,24.6698],[46.5874,24.6664],[46.5778,24.6672],[46.5786,24.6688],[46.5712,24.6719]]]}},{"type":"Feature","properties":{"name":"جامعة الملك سعود"},"geometry":{"type":"Polygon","coordinates":[[[46.6427,24.7276],[46.6222,24.7441],[46.6021,24.7238],[46.6179,24.7109],[46.6232,24.7039],[46.6343,24.7148],[46.6469,24.7205],[46.6427,24.7276]]]}},{"type":"Feature","properties":{"name":"النسيم الغربي"},"geometry":{"type":"Polygon","coordinates":[[[46.8482,24.7132],[46.8203,24.7509],[46.7998,24.7381],[46.8277,24.7004],[46.8482,24.7132]]]}},{"type":"Feature","properties":{"name":"المشاعل"},"geometry":{"type":"Polygon","coordinates":[[[46.9134,24.5964],[46.9056,24.6103],[46.9014,24.6356],[46.8969,24.6459],[46.8241,24.6117],[46.8379,24.6028],[46.8506,24.5913],[46.8692,24.5859],[46.8696,24.5891],[46.8954,24.5953],[46.9134,24.5964]]]}},{"type":"Feature","properties":{"name":"الندوة"},"geometry":{"type":"Polygon","coordinates":[[[46.8892,24.7966],[46.8727,24.8068],[46.8616,24.7918],[46.8783,24.7817],[46.8892,24.7966]]]}},{"type":"Feature","properties":{"name":"الرابية"},"geometry":{"type":"Polygon","coordinates":[[[46.9693,25.0081],[46.97,25.0109],[46.963,25.0096],[46.9588,25.0068],[46.961,25.0037],[46.9444,24.9951],[46.9419,24.9978],[46.9376,24.9974],[46.9382,24.9939],[46.9309,24.9919],[46.927,24.9964],[46.8861,24.9712],[46.883,24.9719],[46.8814,24.975],[46.8734,24.9709],[46.9074,24.9275],[46.9107,24.9286],[46.9119,24.9259],[46.9276,24.9315],[46.9672,24.9583],[46.9801,24.96],[47.0013,24.9673],[47.0128,24.9632],[47.0211,24.9631],[47.0258,24.9727],[47.0247,24.9974],[47.0133,24.9917],[47.0058,24.9926],[47.0034,24.9961],[46.9973,24.9937],[46.9888,24.9982],[46.9859,24.9967],[46.9822,25.001],[46.9762,25.0022],[46.9724,25.0085],[46.9693,25.0081]]]}},{"type":"Feature","properties":{"name":"وادي لبن"},"geometry":{"type":"Polygon","coordinates":[[[46.5705,24.617],[46.554,24.619],[46.5515,24.6167],[46.5534,24.6156],[46.5495,24.6137],[46.5433,24.6148],[46.5411,24.6126],[46.5331,24.6123],[46.5332,24.6106],[46.5412,24.609],[46.5343,24.6084],[46.535,24.6066],[46.5326,24.6052],[46.5345,24.6029],[46.5334,24.6016],[46.5231,24.6031],[46.5177,24.599],[46.5157,24.6009],[46.5159,24.5977],[46.5102,24.5991],[46.5069,24.602],[46.5009,24.6028],[46.5041,24.6051],[46.5002,24.6083],[46.4964,24.6052],[46.4919,24.6071],[46.4857,24.6068],[46.4847,24.6029],[46.4777,24.604],[46.4713,24.6028],[46.4637,24.6049],[46.4647,24.603],[46.462,24.6028],[46.4638,24.5992],[46.4552,24.595],[46.4609,24.592],[46.4526,24.5894],[46.4554,24.5728],[46.4504,24.5742],[46.4482,24.5801],[46.4394,24.5871],[46.4303,24.5875],[46.4409,24.5429],[46.4433,24.5424],[46.4437,24.5457],[46.4469,24.5442],[46.4463,24.5473],[46.4562,24.5524],[46.4583,24.5584],[46.4618,24.5608],[46.4712,24.5607],[46.4702,24.5572],[46.4722,24.5571],[46.4814,24.5641],[46.4859,24.5642],[46.4865,24.5625],[46.4888,24.5626],[46.4825,24.5594],[46.4828,24.5581],[46.4942,24.5566],[46.5066,24.5772],[46.5074,24.5715],[46.515,24.5761],[46.5152,24.5817],[46.5198,24.5818],[46.5226,24.5861],[46.5279,24.5879],[46.5278,24.5914],[46.5313,24.5897],[46.5397,24.5936],[46.545,24.6006],[46.5498,24.6014],[46.5705,24.617]]]}},{"type":"Feature","properties":{"name":"السدرة"},"geometry":{"type":"Polygon","coordinates":[[[46.8771,24.4447],[46.8865,24.4476],[46.8841,24.454],[46.8744,24.451],[46.8771,24.4447]]]}},{"type":"Feature","properties":{"name":"التضامن"},"geometry":{"type":"Polygon","coordinates":[[[47.1267,25.1679],[47.0981,25.1688],[47.0585,25.1197],[47.0479,25.0795],[47.1046,25.0882],[47.1267,25.1679]]]}},{"type":"Feature","properties":{"name":"مدينة الملك عبدالله للطاقة"},"geometry":{"type":"Polygon","coordinates":[[[46.4303,24.5875],[46.4134,24.6027],[46.4092,24.599],[46.3996,24.5962],[46.388,24.585],[46.3462,24.5929],[46.3416,24.5841],[46.3379,24.5838],[46.34,24.5816],[46.3395,24.5795],[46.3318,24.579],[46.3313,24.5748],[46.327,24.5729],[46.3231,24.574],[46.3164,24.5711],[46.3221,24.5703],[46.3228,24.5722],[46.326,24.5717],[46.3325,24.5743],[46.3349,24.5776],[46.3413,24.5759],[46.3445,24.5783],[46.3499,24.5734],[46.35,24.5697],[46.3467,24.5675],[46.3499,24.5682],[46.3488,24.5638],[46.3567,24.5696],[46.3628,24.5663],[46.363,24.5596],[46.3587,24.5581],[46.3545,24.5518],[46.3634,24.5557],[46.3617,24.5477],[46.3638,24.5484],[46.3656,24.5452],[46.3672,24.5365],[46.3654,24.5338],[46.3689,24.5357],[46.3692,24.548],[46.3729,24.5489],[46.3759,24.5442],[46.3766,24.5374],[46.378,24.5439],[46.3796,24.5404],[46.3852,24.5418],[46.3875,24.5366],[46.386,24.5346],[46.3879,24.5339],[46.3866,24.5292],[46.3918,24.5319],[46.3947,24.5282],[46.4058,24.5288],[46.4213,24.5239],[46.4301,24.5236],[46.4419,24.5285],[46.4378,24.5346],[46.4396,24.5366],[46.4433,24.5367],[46.4395,24.5396],[46.4409,24.5429],[46.4303,24.5875]]]}},{"type":"Feature","properties":{"name":"البساتين"},"geometry":{"type":"Polygon","coordinates":[[[47.2703,25.1662],[47.1267,25.1679],[47.1046,25.0882],[47.2032,25.1016],[47.2341,25.1022],[47.259,25.1114],[47.2896,25.117],[47.2703,25.1662]]]}},{"type":"Feature","properties":{"name":"الرحاب"},"geometry":{"type":"Polygon","coordinates":[[[47.3013,25.0877],[47.2896,25.117],[47.259,25.1114],[47.2391,25.1038],[47.2497,25.0707],[47.3013,25.0877]]]}},{"type":"Feature","properties":{"name":"المجد"},"geometry":{"type":"Polygon","coordinates":[[[47.3121,25.0607],[47.3013,25.0877],[47.2497,25.0707],[47.2607,25.0403],[47.2917,25.051],[47.3121,25.0607]]]}},{"type":"Feature","properties":{"name":"الدانة"},"geometry":{"type":"Polygon","coordinates":[[[47.2193,25.0606],[47.2497,25.0707],[47.2391,25.1038],[47.2288,25.1017],[47.2112,25.1016],[47.2193,25.0606]]]}},{"type":"Feature","properties":{"name":"الرسالة"},"geometry":{"type":"Polygon","coordinates":[[[47.2607,25.0403],[47.2497,25.0707],[47.2189,25.0606],[47.2254,25.0265],[47.2429,25.0315],[47.2607,25.0403]]]}},{"type":"Feature","properties":{"name":"الخير"},"geometry":{"type":"Polygon","coordinates":[[[46.4603,25.0375],[46.4302,25.0551],[46.4321,25.061],[46.4038,25.0979],[46.3738,25.0969],[46.3766,25.0374],[46.4217,25.037],[46.4491,25.0219],[46.4566,25.016],[46.4711,25.0351],[46.4821,25.0435],[46.4809,25.0462],[46.4697,25.0503],[46.4603,25.0375]]]}},{"type":"Feature","properties":{"name":"الفرسان"},"geometry":{"type":"Polygon","coordinates":[[[47.2306,24.9969],[47.2254,25.0265],[47.1919,25.0225],[47.154,25.0058],[47.1292,24.9999],[47.1336,24.9939],[47.1458,24.9881],[47.1722,24.982],[47.1844,24.9854],[47.1944,24.9846],[47.1988,24.9872],[47.2094,24.986],[47.2215,24.9973],[47.2306,24.9969]]]}},{"type":"Feature","properties":{"name":"الشعلة"},"geometry":{"type":"Polygon","coordinates":[[[47.0984,25.0444],[47.1815,25.0535],[47.1811,25.0981],[47.1127,25.0894],[47.0984,25.0444]]]}},{"type":"Feature","properties":{"name":"الراية"},"geometry":{"type":"Polygon","coordinates":[[[47.2254,25.0265],[47.2189,25.0606],[47.1815,25.0535],[47.1817,25.0321],[47.1895,25.0348],[47.1946,25.0232],[47.2254,25.0265]]]}},{"type":"Feature","properties":{"name":"الزهور"},"geometry":{"type":"Polygon","coordinates":[[[47.2189,25.0606],[47.2112,25.1016],[47.1811,25.0981],[47.1815,25.0535],[47.2189,25.0606]]]}},{"type":"Feature","properties":{"name":"الزاهر"},"geometry":{"type":"Polygon","coordinates":[[[47.086,25.0055],[47.1127,25.0894],[47.0479,25.0795],[47.0444,25.0687],[47.025,25.0312],[47.0237,25.0196],[47.086,25.0055]]]}},{"type":"Feature","properties":{"name":"المرجان"},"geometry":{"type":"Polygon","coordinates":[[[46.9074,24.9275],[46.8734,24.9709],[46.8704,24.9681],[46.8663,24.9679],[46.8707,24.9596],[46.8631,24.9382],[46.8572,24.9271],[46.8569,24.9201],[46.8527,24.9083],[46.8406,24.905],[46.8431,24.892],[46.8925,24.9189],[46.9119,24.9259],[46.9107,24.9286],[46.9074,24.9275]]]}},{"type":"Feature","properties":{"name":"البيان"},"geometry":{"type":"Polygon","coordinates":[[[46.8845,24.8859],[46.8675,24.9052],[46.8431,24.892],[46.8509,24.8519],[46.8501,24.8394],[46.8708,24.8603],[46.878,24.8787],[46.8845,24.8859]]]}},{"type":"Feature","properties":{"name":"العلا"},"geometry":{"type":"Polygon","coordinates":[[[47.1817,25.0321],[47.1815,25.0535],[47.0984,25.0444],[47.0802,24.9865],[47.1085,24.9924],[47.1271,24.9994],[47.1499,25.0044],[47.1946,25.0232],[47.1895,25.0348],[47.1817,25.0321]]]}},{"type":"Feature","properties":{"name":"المشرق"},"geometry":{"type":"Polygon","coordinates":[[[47.086,25.0055],[47.0237,25.0196],[47.0258,24.9729],[47.0205,24.9615],[47.0193,24.9498],[47.0167,24.9448],[47.0348,24.9502],[47.0502,24.9589],[47.0701,24.98],[47.0802,24.9865],[47.086,25.0055]]]}},{"type":"Feature","properties":{"name":"النخبة"},"geometry":{"type":"Polygon","coordinates":[[[47.311,25.0076],[47.3111,25.0202],[47.3127,25.0237],[47.3247,25.0311],[47.3121,25.0607],[47.2909,25.0507],[47.2657,25.0426],[47.2429,25.0315],[47.2254,25.0265],[47.2306,24.9969],[47.2443,25.0038],[47.2482,25.0027],[47.2522,24.9978],[47.2604,24.9978],[47.2695,25.0031],[47.2718,25.0015],[47.2732,24.9917],[47.2816,24.9903],[47.2898,24.9991],[47.2999,25.0017],[47.3069,25.0111],[47.311,25.0076]]]}},{"type":"Feature","properties":{"name":"السحاب"},"geometry":{"type":"Polygon","coordinates":[[[47.0128,24.9632],[47.0013,24.9673],[46.9801,24.96],[46.9672,24.9583],[46.9276,24.9315],[46.9112,24.9256],[46.9175,24.9185],[46.9198,24.9199],[46.9279,24.9111],[46.9406,24.9201],[46.956,24.9264],[46.9687,24.9373],[46.978,24.9422],[46.99,24.9449],[47.0167,24.9448],[47.0193,24.9498],[47.0211,24.9631],[47.0128,24.9632]]]}},{"type":"Feature","properties":{"name":"الوسام"},"geometry":{"type":"Polygon","coordinates":[[[46.9112,24.9256],[46.8925,24.9189],[46.8675,24.9052],[46.8845,24.8859],[46.8913,24.8906],[46.9034,24.8948],[46.9142,24.9036],[46.9279,24.9111],[46.9198,24.9199],[46.9175,24.9185],[46.9112,24.9256]]]}}]};

/* --- source lines 2305-2372 --- */
const I18N = {
  ar: {
    eyebrow: 'CityView 2.0 · وزارة الشؤون البلدية والقروية والإسكان', title: 'مركز قيادة أداء المدينة',
    lv_kingdom: 'المملكة', lv_city: 'المدن', lv_district: 'الأحياء', live: 'بث مباشر',
    rail_ttl: 'مؤشرات قطاع التراخيص والامتثال',
    tab_map: 'الخريطة', tab_trend: 'الاتجاه الزمني', tab_dims: 'تفكيك الأبعاد', tab_matrix: 'مصفوفة الأداء',
    drill_ttl: 'تحليل تراجع المؤشر — أين؟ وما السبب؟', btn_tree: 'شجرة السبب الكاملة ↗',
    ai_ttl: 'مساعد المدينة الذكي', ask_ph: 'اسأل عن أي مؤشر أو منطقة أو حي…', ask_go: 'اسأل',
    feed_ttl: 'البث المباشر لأحداث المدينة', fs_k: 'المملكة', fs_c: 'المدينة', fs_d: 'الحي',
    kingdom: 'المملكة', strategic: 'استراتيجي', tactical: 'تشغيلي',
    tgt: 'المستهدف', vs_tgt: 'الفجوة عن المستهدف', mom: 'شهري', d3m: '٣ أشهر', u_day: 'يوم', u_per10k: '/ ١٠ آلاف',
    b_exc: 'متحقق', b_good: 'قريب من المستهدف', b_fair: 'متوسط', b_weak: 'متعثر', b_crit: 'حرج',
    where_ttl: 'أين يتراجع المؤشر؟', what_ttl: 'ما سبب التراجع؟',
    where_hint: 'مساهمة كل نطاق في الفجوة عن المستهدف — اضغط للتنقل', what_hint: 'مسببات تشغيلية مرتبة حسب أثرها على الفجوة',
    dim_ttl: 'مساهمة الأبعاد', of_gap: 'من الفجوة', drivers: 'المسببات التشغيلية', owner: 'الجهة المسؤولة',
    evidence: 'الدليل', action: 'الإجراء المقترح', uplift: 'الأثر المتوقع', pts: 'نقطة',
    no_children: 'لا يوجد تفصيل أدنى لهذا النطاق', ranked: 'الأسوأ أولًا',
    ai_anom: 'رصد شذوذ', ai_diag: 'تشخيص', ai_cause: 'السبب الجذري', ai_fc: 'تنبؤ', ai_reco: 'توصية', ai_corr: 'ارتباط',
    conf: 'الثقة', high: 'عالية', mid: 'متوسطة', low: 'منخفضة',
    ev_now: 'الآن', ev_min: 'د', ev_h: 'س',
    c_cx: 'شكوى', c_insp: 'تفتيش', c_vio: 'مخالفة', c_enf: 'إنفاذ',
    trend_ttl: 'تطور المؤشر مقابل المستهدف', dims_ttl: 'تفكيك المؤشر على الأبعاد', matrix_ttl: 'مصفوفة الأداء — المؤشرات × النطاقات',
    tree_ttl: 'شجرة السبب الجذري', lvl1: 'المؤشر', lvl2: 'البعد الأكثر أثرًا', lvl3: 'النطاق الجغرافي', lvl4: 'المسبب التشغيلي',
    cur: 'القيمة الحالية', proj: 'المتوقع ديسمبر ٢٠٢٦', prob: 'احتمال تحقيق المستهدف',
    reco_ttl: 'حزمة الإجراءات المقترحة', impact: 'الأثر التقديري', eff: 'الجهد', owner2: 'المالك',
    eff_l: 'منخفض', eff_m: 'متوسط', eff_h: 'مرتفع',
    scope: 'النطاق', pop: 'السكان', units: 'نطاقات فرعية', complaints: 'شكاوى الفترة',
    share_of_cx: 'من حجم الشكاوى', matrix_hint: 'الخلايا ملوّنة حسب البعد عن المستهدف — اضغط أي خلية للتنقل',
    ask_c1: 'لماذا تراجع الالتزام؟', ask_c2: 'أسوأ ٥ أحياء', ask_c3: 'توقع نهاية العام', ask_c4: 'قارن الرياض ومكة', ask_c5: 'ما الإجراء الأسرع أثرًا؟',
    ans_pre: 'الإجابة مبنية على بيانات النطاق المعروض للفترة المحددة.',
    no_data: 'لا تتوفر بيانات كافية لهذا السؤال — جرّب اسم مؤشر أو منطقة.',
    events: 'حدث/الدقيقة', paused: 'موقوف', playing: 'مباشر',
    proto: 'بيانات محاكاة لأغراض العرض — نموذج أولي',
  },
  en: {
    eyebrow: 'CityView 2.0 · Ministry of Municipal & Rural Affairs and Housing', title: 'City Performance Command Center',
    lv_kingdom: 'Kingdom', lv_city: 'Cities', lv_district: 'Districts', live: 'Live',
    rail_ttl: 'Regulatory Compliance & Enforcement KPIs',
    tab_map: 'Map', tab_trend: 'Trend', tab_dims: 'Dimension breakdown', tab_matrix: 'Performance matrix',
    drill_ttl: 'Degradation analysis — where and why?', btn_tree: 'Full cause tree ↗',
    ai_ttl: 'CityGPT insights', ask_ph: 'Ask about any KPI, region or district…', ask_go: 'Ask',
    feed_ttl: 'Real-time city feed', fs_k: 'Kingdom', fs_c: 'City', fs_d: 'District',
    kingdom: 'Kingdom', strategic: 'Strategic', tactical: 'Tactical',
    tgt: 'Target', vs_tgt: 'Gap to target', mom: 'MoM', d3m: '3-mo', u_day: 'days', u_per10k: '/10k',
    b_exc: 'On target', b_good: 'Near target', b_fair: 'Moderate', b_weak: 'Off track', b_crit: 'Critical',
    where_ttl: 'Where is it degrading?', what_ttl: 'What is causing it?',
    where_hint: 'Contribution of each scope to the gap — click to drill in', what_hint: 'Operational drivers ranked by impact on the gap',
    dim_ttl: 'Dimension contribution', of_gap: 'of gap', drivers: 'Operational drivers', owner: 'Accountable entity',
    evidence: 'Evidence', action: 'Recommended action', uplift: 'Expected impact', pts: 'pts',
    no_children: 'No further breakdown for this scope', ranked: 'Worst first',
    ai_anom: 'Anomaly', ai_diag: 'Diagnosis', ai_cause: 'Root cause', ai_fc: 'Forecast', ai_reco: 'Recommendation', ai_corr: 'Correlation',
    conf: 'Confidence', high: 'High', mid: 'Medium', low: 'Low',
    ev_now: 'now', ev_min: 'm', ev_h: 'h',
    c_cx: 'Complaints', c_insp: 'Inspections', c_vio: 'Violations', c_enf: 'Enforcement',
    trend_ttl: 'KPI trajectory vs target', dims_ttl: 'KPI decomposition by dimension', matrix_ttl: 'Performance matrix — KPIs × scopes',
    tree_ttl: 'Root-cause tree', lvl1: 'KPI', lvl2: 'Largest dimension', lvl3: 'Geography', lvl4: 'Operational driver',
    cur: 'Current', proj: 'Projected Dec 2026', prob: 'Probability of hitting target',
    reco_ttl: 'Recommended action package', impact: 'Est. impact', eff: 'Effort', owner2: 'Owner',
    eff_l: 'Low', eff_m: 'Medium', eff_h: 'High',
    scope: 'Scope', pop: 'Population', units: 'Sub-scopes', complaints: 'Complaints in period',
    share_of_cx: 'of complaint volume', matrix_hint: 'Cells shaded by distance from target — click any cell to drill in',
    ask_c1: 'Why did compliance drop?', ask_c2: 'Worst 5 districts', ask_c3: 'Year-end forecast', ask_c4: 'Compare Riyadh and Makkah', ask_c5: 'Fastest action?',
    ans_pre: 'Answer computed from the selected scope and period.',
    no_data: 'Not enough to answer that — try a KPI or region name.',
    events: 'events/min', paused: 'Paused', playing: 'Live',
    proto: 'Simulated data — prototype for demonstration',
  }
};

/* --- source lines 2374-2579 --- */
/* ---------- operational driver library ---------- */
function D(ar, en, evAr, evEn, w, dim, oAr, oEn, aAr, aEn, up, eff) {
  return { ar, en, ev: { ar: evAr, en: evEn }, w, dim, own: { ar: oAr, en: oEn }, act: { ar: aAr, en: aEn }, up, eff };
}
const DRIVERS = {
  ttl: [
    D('تكدس الطلبات في مرحلة الفحص الفني', 'Backlog at technical review stage',
      'متوسط الانتظار <b>{d} يوم</b> في مرحلة الفحص من إجمالي <b>{n}</b> طلبًا قائمًا', 'Average wait of <b>{d} days</b> at review, across <b>{n}</b> open applications',
      1.0, null, 'الأمانة — إدارة التراخيص', 'Amana — Licensing Dept.',
      'توزيع حِمل الفحص آليًا على مراجعين من أمانات أخرى في أوقات الذروة', 'Auto-balance review workload to reviewers in other Amanas at peak',
      .34, 'm'),
    D('نقص كوادر الفحص مقابل حجم الطلبات', 'Reviewer capacity below application volume',
      '<b>{n}</b> طلبًا لكل مراجع مقابل معيار <b>45</b> طلبًا', '<b>{n}</b> applications per reviewer vs a benchmark of <b>45</b>',
      .85, 'construction', 'الأمانة — الموارد البشرية', 'Amana — HR',
      'تعزيز فرق الفحص في المدن الأربع الأعلى طلبًا', 'Reinforce review teams in the four highest-volume cities', .28, 'h'),
    D('نواقص مستندات المتقدمين وإعادة الطلب', 'Applicant document gaps and re-submissions',
      '<b>{p}%</b> من الطلبات أُعيدت للمتقدم مرة واحدة على الأقل (<b>{n}</b> طلبًا)', '<b>{p}%</b> of applications returned at least once (<b>{n}</b> applications)',
      .75, 'retail', 'مركز خدمة المستفيدين', 'Beneficiary Service Center',
      'تفعيل التحقق الآلي من المستندات قبل الإرسال', 'Enable automated document validation before submission', .22, 'l'),
    D('انتظار موافقات جهات خارجية', 'Waiting on external agency clearances',
      '<b>{n}</b> طلبًا معلقًا بانتظار جهات خدمية بمتوسط <b>{d} يوم</b>', '<b>{n}</b> applications pending utility clearance, averaging <b>{d} days</b>',
      .8, 'excavation', 'الجهات الخدمية', 'Utility providers',
      'ربط تكاملي مباشر لتصاريح الجهات الخدمية بدل التبادل اليدوي', 'Direct API integration for utility clearances instead of manual exchange', .3, 'm'),
    D('تعدد دورات المعاينة الميدانية', 'Repeated field inspection cycles',
      'متوسط <b>{n}</b> معاينة لكل رخصة مقابل مستهدف <b>1.2</b>', 'Average <b>{n}</b> site visits per license vs a target of <b>1.2</b>',
      .6, 'health', 'الأمانة — التفتيش', 'Amana — Inspection',
      'استخدام قائمة تحقق موحدة ومعاينة واحدة شاملة', 'Adopt one consolidated checklist and a single combined visit', .18, 'l'),
  ],
  cov: [
    D('السعة التفتيشية أقل من حجم المنشآت', 'Inspection capacity below establishment base',
      '<b>{n}</b> مفتشًا لتغطية <b>{m}</b> منشأة ومَوقعًا', '<b>{n}</b> inspectors covering <b>{m}</b> establishments and sites',
      1.0, null, 'الأمانة — التفتيش', 'Amana — Inspection',
      'إعادة توزيع المفتشين حسب كثافة المخالفات لا حسب الحدود الإدارية', 'Redistribute inspectors by violation density, not administrative boundaries', .38, 'm'),
    D('تكرار الزيارات لنفس المنشآت', 'Revisits concentrated on the same establishments',
      '<b>{p}%</b> من الزيارات لمنشآت زُيرت خلال ٣٠ يومًا (<b>{n}</b> زيارة)', '<b>{p}%</b> of visits went to sites already visited within 30 days (<b>{n}</b> visits)',
      .8, 'retail', 'الأمانة — التفتيش', 'Amana — Inspection',
      'جدولة الزيارات بمحرك مخاطر يمنع التكرار غير المبرر', 'Risk-engine scheduling that suppresses unjustified revisits', .26, 'l'),
    D('سجل المنشآت غير محدَّث', 'Establishment register out of date',
      '<b>{n}</b> منشأة بعنوان أو إحداثيات غير مطابقة للواقع', '<b>{n}</b> establishments with address or coordinates that do not match reality',
      .7, null, 'مركز البيانات البلدية', 'Municipal Data Center',
      'مطابقة السجل مع بيانات العنوان الوطني والرخص النشطة', 'Reconcile the register against the National Address and active licenses', .21, 'm'),
    D('مواقع الحفريات المؤقتة خارج دورة التفتيش', 'Temporary excavation sites outside the inspection cycle',
      '<b>{n}</b> موقع حفر نشِط دون زيارة خلال مدة التصريح', '<b>{n}</b> active excavation sites with no visit during the permit window',
      .95, 'excavation', 'الأمانة + الجهات الخدمية', 'Amana + Utility providers',
      'ربط بدء أعمال الحفر بإشعار تفتيش إلزامي خلال ٤٨ ساعة', 'Trigger a mandatory inspection notice within 48h of works starting', .34, 'l'),
    D('انخفاض تغطية مساكن العمال', 'Low coverage of worker accommodation',
      '<b>{p}%</b> فقط من مواقع الإسكان الجماعي المسجلة مغطاة', 'Only <b>{p}%</b> of registered group-accommodation sites covered',
      .85, 'group', 'الأمانة + وزارة الموارد البشرية', 'Amana + MHRSD',
      'حملة تغطية مشتركة على مواقع الإسكان الجماعي عالية المخاطر', 'Joint coverage campaign on high-risk group-accommodation sites', .3, 'm'),
  ],
  comp: [
    D('تصاريح حفر منتهية دون تجديد أو إغلاق', 'Expired excavation permits not renewed or closed',
      '<b>{n}</b> تصريحًا منتهيًا ولا يزال الموقع مفتوحًا', '<b>{n}</b> expired permits with the site still open',
      1.0, 'excavation', 'الأمانة + الجهات الخدمية', 'Amana + Utility providers',
      'إيقاف تلقائي لأعمال الحفر عند انتهاء التصريح مع إشعار المشغل', 'Auto-suspend works on permit expiry with operator notification', .4, 'l'),
    D('إعادة الوضع لأصله غير مكتملة', 'Site reinstatement not completed',
      '<b>{n}</b> موقعًا لم تُستكمل إعادته بعد <b>{d} يومًا</b> من انتهاء الأعمال', '<b>{n}</b> sites unrestored <b>{d} days</b> after works ended',
      .9, 'excavation', 'الجهات الخدمية', 'Utility providers',
      'ربط الإفراج عن الضمان المالي باكتمال إعادة الوضع ميدانيًا', 'Tie release of the financial guarantee to verified reinstatement', .32, 'm'),
    D('شروط ترخيص غير مطبَّقة بعد الإصدار', 'Post-issuance license conditions not applied',
      '<b>{p}%</b> من المنشآت المفتَّشة خالفت شرطًا واحدًا على الأقل (<b>{n}</b> منشأة)', '<b>{p}%</b> of inspected establishments breached at least one condition (<b>{n}</b>)',
      .85, 'retail', 'الأمانة — التفتيش', 'Amana — Inspection',
      'زيارة تحقق إلزامية خلال ٣٠ يومًا من إصدار الرخصة', 'Mandatory verification visit within 30 days of issuance', .27, 'm'),
    D('اشتراطات صحية غير مستوفاة في المطاعم', 'Unmet health requirements in food establishments',
      '<b>{n}</b> منشأة غذائية بمخالفات صحية متكررة', '<b>{n}</b> food establishments with repeat health violations',
      .7, 'health', 'الأمانة — الصحة العامة', 'Amana — Public Health',
      'برنامج امتثال مُلزم للمنشآت متكررة المخالفة', 'Mandatory compliance programme for repeat offenders', .24, 'm'),
    D('اشتراطات السكن الجماعي غير مستوفاة', 'Group accommodation standards not met',
      '<b>{n}</b> مبنى إسكان جماعي دون اشتراطات السلامة والكثافة', '<b>{n}</b> group-accommodation buildings failing safety and density standards',
      .8, 'group', 'الأمانة + الدفاع المدني', 'Amana + Civil Defense',
      'تفتيش مشترك وإخلاء تدريجي للمباني عالية الخطورة', 'Joint inspection and phased evacuation of high-risk buildings', .3, 'h'),
  ],
  enf: [
    D('إنذارات صادرة دون تبليغ موثَّق', 'Warnings issued without documented service',
      '<b>{n}</b> إنذارًا دون إثبات تبليغ للمخالف', '<b>{n}</b> warnings with no proof of service on the violator',
      1.0, null, 'الأمانة — الإنفاذ', 'Amana — Enforcement',
      'تبليغ إلكتروني موثَّق عبر أبشر/واتساب مع إثبات استلام', 'Documented e-service via Absher/WhatsApp with delivery receipt', .36, 'l'),
    D('تأخر تحصيل الغرامات', 'Fine collection lag',
      '<b>{p}%</b> من الغرامات غير محصلة بعد <b>60</b> يومًا (<b>{n}</b> غرامة)', '<b>{p}%</b> of fines uncollected after <b>60</b> days (<b>{n}</b> fines)',
      .85, 'retail', 'الأمانة — المالية', 'Amana — Finance',
      'ربط تحصيل الغرامة بتجديد الرخصة والخدمات البلدية', 'Link fine settlement to license renewal and municipal services', .3, 'l'),
    D('قضايا معلقة في لجنة المخالفات', 'Cases pending at the violations committee',
      '<b>{n}</b> قضية معلقة بمتوسط <b>{d} يومًا</b> منذ الإحالة', '<b>{n}</b> cases pending, averaging <b>{d} days</b> since referral',
      .8, 'construction', 'لجنة المخالفات البلدية', 'Municipal Violations Committee',
      'جلسات أسبوعية مُجمَّعة للقضايا المتشابهة وتفويض القرارات البسيطة', 'Weekly batched sessions for similar cases; delegate simple decisions', .28, 'm'),
    D('تداخل الاختصاص مع جهة خارجية', 'Jurisdiction overlap with an external entity',
      '<b>{n}</b> مخالفة تحتاج قرار جهة أخرى قبل الإنفاذ', '<b>{n}</b> violations requiring another entity to act before enforcement',
      .75, 'excavation', 'الأمانة + الجهات الخدمية', 'Amana + Utility providers',
      'اتفاقية مستوى خدمة ملزمة بمدة استجابة ٥ أيام عمل', 'Binding SLA with a five-working-day response window', .26, 'm'),
    D('عدم متابعة إزالة المخالفة بعد الإنذار', 'No follow-up after the warning is issued',
      '<b>{p}%</b> من الإنذارات دون زيارة متابعة (<b>{n}</b> حالة)', '<b>{p}%</b> of warnings with no follow-up visit (<b>{n}</b> cases)',
      .9, 'group', 'الأمانة — الإنفاذ', 'Amana — Enforcement',
      'جدولة تلقائية لزيارة متابعة عند انتهاء مدة الإنذار', 'Auto-schedule a follow-up visit when the warning window expires', .33, 'l'),
  ],
  vpenf: [
    D('عناصر مرصودة بانتظار مالك الاختصاص', 'Detected elements waiting on the accountable owner',
      '<b>{n}</b> عنصرًا مرصودًا خارج اختصاص الأمانة المباشر', '<b>{n}</b> detected elements outside the Amana’s direct mandate',
      1.0, null, 'الجهات الشريكة', 'Partner entities',
      'لوحة مشتركة مع الجهات الشريكة وتصعيد آلي عند تجاوز المدة', 'Shared dashboard with partners and auto-escalation on breach', .35, 'm'),
    D('تكرار العنصر في نفس الموقع بعد الإزالة', 'Element recurs at the same location after removal',
      '<b>{p}%</b> من العناصر عادت خلال <b>90</b> يومًا (<b>{n}</b> عنصرًا)', '<b>{p}%</b> of elements recurred within <b>90</b> days (<b>{n}</b> elements)',
      .9, null, 'الأمانة — النظافة والتجميل', 'Amana — Cleanliness & Beautification',
      'معالجة جذرية للمواقع متكررة التشوه بدل الإزالة المتكررة', 'Permanent treatment of recurring hotspots instead of repeat removal', .3, 'm'),
    D('عقود النظافة والصيانة دون مستوى الخدمة', 'Cleanliness and maintenance contracts below SLA',
      '<b>{n}</b> بلاغًا تجاوز مدة العقد المتعاقد عليها', '<b>{n}</b> reports exceeded the contracted resolution window',
      .8, null, 'المركز الوطني لإدارة النفايات', 'National Waste Management Center',
      'خصم تعاقدي آلي مرتبط ببيانات الإنجاز في المنصة', 'Automated contractual deductions tied to platform completion data', .27, 'l'),
    D('حفريات ومخلفات مشاريع دون تسييج ومعالجة', 'Excavations and project debris without hoarding or clearance',
      '<b>{n}</b> موقعًا دون تسييج أو لوحات تعريف نظامية', '<b>{n}</b> sites without hoarding or statutory signage',
      .85, 'vp3', 'الأمانة — الرقابة الإنشائية', 'Amana — Construction Control',
      'إلزام المقاول بصورة جيوموقعية قبل صرف المستخلص', 'Require geo-tagged photo evidence before contractor payment', .29, 'l'),
    D('لوحات تجارية وإعلانية غير نظامية', 'Non-compliant commercial and advertising signage',
      '<b>{n}</b> لوحة غير مطابقة للدليل الإرشادي', '<b>{n}</b> signs not conforming to the guidance manual',
      .7, 'vp2', 'الأمانة — الاستثمار', 'Amana — Investment',
      'حصر آلي للوحات عبر صور الشوارع وربطه برخصة اللوحة', 'Automated sign inventory from street imagery linked to sign permits', .24, 'm'),
  ],
  uin: [
    D('رخص بناء صادرة دون مراجعة دليل الهوية', 'Permits issued without urban-identity review',
      '<b>{n}</b> رخصة صادرة دون توثيق مراجعة الهوية العمرانية', '<b>{n}</b> permits issued with no documented identity review',
      1.0, 'amana', 'الأمانة — التخطيط العمراني', 'Amana — Urban Planning',
      'فحص إلزامي للهوية العمرانية في مسار إصدار الرخصة', 'Mandatory identity check inside the permit issuance flow', .4, 'l'),
    D('تنفيذ يخالف المخططات المعتمدة', 'As-built deviates from approved drawings',
      '<b>{n}</b> مبنى نُفِّذ بواجهات مختلفة عن المعتمد', '<b>{n}</b> buildings built with façades differing from the approval',
      .9, 'city', 'الأمانة — الرقابة الإنشائية', 'Amana — Construction Control',
      'مطابقة صور الواجهة عند طلب شهادة الإتمام', 'Façade image matching at completion-certificate stage', .32, 'm'),
    D('غياب التحقق الميداني قبل الإفراغ', 'No field verification before handover',
      '<b>{p}%</b> من الشهادات صدرت دون زيارة تحقق', '<b>{p}%</b> of certificates issued without a verification visit',
      .8, 'district', 'البلدية الفرعية', 'District municipality',
      'زيارة تحقق إلزامية مع نموذج مصور موحّد', 'Mandatory verification visit with a standard photo form', .28, 'm'),
    D('عدم إلمام المكاتب الهندسية بالدليل', 'Design offices unfamiliar with the manual',
      '<b>{n}</b> مكتبًا هندسيًا بمخالفات هوية متكررة', '<b>{n}</b> engineering offices with repeat identity violations',
      .65, null, 'الهيئة السعودية للمهندسين', 'Saudi Council of Engineers',
      'تأهيل إلزامي للمكاتب متكررة المخالفة', 'Mandatory re-certification for repeat-offending offices', .2, 'l'),
  ],
  uio: [
    D('برامج معالجة الواجهات القائمة متأخرة', 'Existing-façade remediation programmes behind plan',
      '<b>{n}</b> مبنى في قائمة المعالجة تجاوز الجدول الزمني', '<b>{n}</b> buildings on the remediation list past schedule',
      1.0, 'amana', 'الأمانة — التجميل الحضري', 'Amana — Urban Beautification',
      'ربط برنامج المعالجة بحوافز ملاك العقار والتمويل الميسر', 'Link remediation to owner incentives and soft financing', .34, 'h'),
    D('عدم تعاون ملاك العقارات', 'Property-owner non-cooperation',
      '<b>{p}%</b> من الإشعارات دون استجابة المالك (<b>{n}</b> إشعارًا)', '<b>{p}%</b> of notices with no owner response (<b>{n}</b> notices)',
      .85, 'district', 'الأمانة — الإنفاذ', 'Amana — Enforcement',
      'تدرّج إنفاذي واضح ينتهي بالمعالجة على حساب المالك', 'A clear escalation ladder ending in remediation at owner cost', .3, 'm'),
    D('مبانٍ مهجورة دون مالك معروف', 'Abandoned buildings with no identified owner',
      '<b>{n}</b> مبنى مهجورًا دون بيانات ملكية محدَّثة', '<b>{n}</b> abandoned buildings without updated ownership data',
      .8, 'city', 'الأمانة + الهيئة العامة للعقار', 'Amana + REGA',
      'مطابقة السجل العقاري لتحديد الملاك ثم التصعيد', 'Reconcile the real-estate register to identify owners, then escalate', .27, 'm'),
    D('نطاقات تاريخية بقيود فنية', 'Heritage zones with technical constraints',
      '<b>{n}</b> مبنى داخل نطاق تراثي يحتاج موافقات خاصة', '<b>{n}</b> buildings in heritage zones requiring special approvals',
      .6, null, 'هيئة التراث + الأمانة', 'Heritage Commission + Amana',
      'مسار موافقات مسرّع للنطاقات التراثية', 'Fast-track approval route for heritage zones', .18, 'm'),
  ],
  cx: [
    D('تكرار البلاغات على نفس الموقع دون معالجة جذرية', 'Repeat reports on the same location without a permanent fix',
      '<b>{n}</b> بلاغًا مكررًا على <b>{m}</b> موقعًا فقط', '<b>{n}</b> repeat reports concentrated on just <b>{m}</b> locations',
      1.0, null, 'مركز البلاغات البلدية', 'Municipal Reporting Center',
      'تحويل المواقع متكررة البلاغات إلى أوامر عمل معالجة جذرية', 'Convert repeat-report locations into permanent-fix work orders', .35, 'm'),
    D('تجاوز زمن المعالجة المستهدف', 'Resolution time above target',
      'متوسط المعالجة <b>{d} يومًا</b> مقابل مستهدف <b>3</b> أيام', 'Average resolution <b>{d} days</b> against a <b>3</b>-day target',
      .9, 'retail', 'الأمانة — العمليات', 'Amana — Operations',
      'توجيه البلاغات آليًا إلى أقرب فريق ميداني متاح', 'Auto-route reports to the nearest available field team', .3, 'l'),
    D('إعادة فتح البلاغات بعد الإغلاق', 'Reports re-opened after closure',
      '<b>{p}%</b> من البلاغات أُعيد فتحها (<b>{n}</b> بلاغًا)', '<b>{p}%</b> of reports were re-opened (<b>{n}</b> reports)',
      .8, null, 'الأمانة — الجودة', 'Amana — Quality',
      'تحقق مصوّر إلزامي قبل إغلاق البلاغ', 'Mandatory photo verification before closure', .26, 'l'),
    D('بلاغات أعمال الحفر والطرق', 'Excavation and roadworks reports',
      '<b>{n}</b> بلاغًا عن حفريات وأعمال طرق غير مسيَّجة', '<b>{n}</b> reports on unfenced excavation and roadworks',
      .95, 'excavation', 'الأمانة + الجهات الخدمية', 'Amana + Utility providers',
      'إشعار مسبق للسكان وتسييج نظامي إلزامي لكل تصريح', 'Advance resident notification and mandatory hoarding per permit', .32, 'm'),
  ],
  sat: [
    D('طول زمن الاستجابة للبلاغات', 'Long response time to citizen reports',
      'متوسط أول استجابة <b>{d} يومًا</b> مقابل مستهدف <b>1</b> يوم', 'First response averages <b>{d} days</b> against a <b>1</b>-day target',
      1.0, 'cmp', 'الأمانة — العمليات', 'Amana — Operations',
      'استجابة أولى آلية خلال ٤ ساعات مع موعد معالجة متوقع', 'Automated first response within 4 hours with an expected fix date', .34, 'l'),
    D('عدم إشعار المواطن بإغلاق البلاغ', 'Citizen not notified when a report is closed',
      '<b>{p}%</b> من البلاغات أُغلقت دون إشعار المُبلِّغ (<b>{n}</b> بلاغًا)', '<b>{p}%</b> of reports closed without notifying the reporter (<b>{n}</b>)',
      .85, 'cmp', 'مركز البلاغات البلدية', 'Municipal Reporting Center',
      'إشعار إغلاق مع صورة المعالجة عبر واتساب', 'Closure notification with fix photo via WhatsApp', .3, 'l'),
    D('طول إجراءات إصدار الرخص', 'Licensing journey too long',
      '<b>{p}%</b> من المستفيدين قيّموا رحلة الترخيص دون <b>3</b> من <b>5</b>', '<b>{p}%</b> of applicants rated the licensing journey below <b>3</b> of <b>5</b>',
      .8, 'lic', 'الأمانة — التراخيص', 'Amana — Licensing',
      'تبسيط المسار وإلغاء المستندات المتاحة حكوميًا', 'Simplify the journey and drop documents already held by government', .28, 'm'),
    D('تكرار التشوه بعد الإزالة', 'Visual pollution recurring after removal',
      '<b>{n}</b> موقعًا عاد إليه التشوه خلال ٩٠ يومًا', '<b>{n}</b> locations where visual pollution returned within 90 days',
      .75, 'vp', 'الأمانة — النظافة والتجميل', 'Amana — Cleanliness & Beautification',
      'صيانة وقائية دورية للمواقع الحساسة', 'Preventive maintenance cycles for sensitive locations', .24, 'm'),
  ],
};
/* pick and quantify the drivers behind a unit's gap on a KPI */
function driversFor(uid, kpi, topDimKey) {
  const list = DRIVERS[kpi] || [], u = U[uid];
  const scored = list.map((d, i) => {
    const aff = d.dim && d.dim === topDimKey ? 2.1 : d.dim ? .55 : 1;
    return { d, s: d.w * aff * (1 + jit(uid + kpi + i, .3)) };
  }).sort((a, b) => b.s - a.s).slice(0, 3);
  const tot = scored.reduce((s, x) => s + x.s, 0);
  const sz = clamp(u.pop / 900, 12, 9000);
  return scored.map((x, i) => {
    const r = rng(uid + kpi + 'ev' + i);
    const n = Math.round(sz * (.12 + r() * .5) + 6), m = Math.max(2, Math.round(n * (.05 + r() * .12)));
    const p = Math.round(18 + r() * 42), dd = +(2 + r() * 16).toFixed(1);
    return { ...x.d, share: x.s / tot,
      evTxt: nm(x.d.ev).replace('{n}', NF(n)).replace('{m}', NF(m)).replace('{p}', p).replace('{d}', dd) };
  });
}

/* --- source lines 2588-2600 --- */
let LANG = 'ar';
const T = k => (I18N[LANG][k] !== undefined ? I18N[LANG][k] : k);
const nm = o => (!o ? '' : (LANG === 'ar' ? o.ar : (o.en || o.ar)));
const NF = (v, d = 0) => (v === null || v === undefined || isNaN(v)) ? '—' :
  Number(v).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const PCT = v => NF(v, 1) + '%';

/* ---------- deterministic RNG ---------- */
function h32(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) { let a = typeof seed === 'string' ? h32(seed) : seed; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const jit = (seed, amp) => (rng(seed)() * 2 - 1) * amp;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));


/* --- source lines 2602-2670 --- */
const KPIS = [
  { id: 'ttl', ic: '⏱', tier: 's', u: 'd', dir: -1, tgt: 9, dec: 1, prim: 'lic', sec: 'org',
    ar: 'زمن إصدار الرخصة', en: 'Time to Issue License',
    dAr: 'متوسط الأيام من استكمال الطلب حتى إصدار الرخصة', dEn: 'Average days from complete application to license issuance' },
  { id: 'cov', ic: '🎯', tier: 's', u: '%', dir: 1, tgt: 70, dec: 1, prim: 'lic', sec: 'vp',
    ar: 'تغطية التفتيش', en: 'Inspection Coverage',
    dAr: 'نسبة المنشآت والمواقع المشمولة بزيارة تفتيشية خلال الفترة', dEn: 'Share of establishments and sites covered by an inspection visit in the period' },
  { id: 'comp', ic: '✔', tier: 's', u: '%', dir: 1, tgt: 78, dec: 1, prim: 'lic', sec: 'vp',
    ar: 'نسبة الالتزام بالرخص', en: 'License Compliance Rate',
    dAr: 'نسبة المنشآت الملتزمة بشروط الترخيص من إجمالي المفتّشة', dEn: 'Share of inspected establishments compliant with license conditions' },
  { id: 'enf', ic: '⚖', tier: 's', u: '%', dir: 1, tgt: 72, dec: 1, prim: 'lic', sec: 'org',
    ar: 'نسبة إنفاذ مخالفات الرخص', en: 'License Enforcement Rate',
    dAr: 'نسبة المخالفات المنفَّذة (إنذار/غرامة/إيقاف) من المخالفات المرصودة', dEn: 'Share of detected violations enforced (warning / fine / suspension)' },
  { id: 'vpenf', ic: '👁', tier: 's', u: '%', dir: 1, tgt: 72, dec: 1, prim: 'vp', sec: 'org',
    ar: 'نسبة إنفاذ التشوه البصري', en: 'VP Enforcement Rate',
    dAr: 'نسبة عناصر التشوه البصري المعالجة من المرصودة', dEn: 'Share of detected visual-pollution elements resolved' },
  { id: 'uin', ic: '🏛', tier: 's', u: '%', dir: 1, tgt: 88, dec: 1, prim: 'org', sec: null,
    ar: 'الالتزام بالهوية العمرانية — مبانٍ جديدة', en: 'Urban Identity Compliance — New Buildings',
    dAr: 'نسبة المباني الجديدة المطابقة لدليل الهوية العمرانية', dEn: 'Share of new buildings conforming to the urban identity manual' },
  { id: 'uio', ic: '🏚', tier: 's', u: '%', dir: 1, tgt: 68, dec: 1, prim: 'org', sec: null,
    ar: 'الالتزام بالهوية العمرانية — مبانٍ قائمة', en: 'Urban Identity Compliance — Existing Buildings',
    dAr: 'نسبة المباني القائمة المعالجة وفق دليل الهوية العمرانية', dEn: 'Share of existing buildings remediated per the urban identity manual' },
  { id: 'cx', ic: '📣', tier: 't', u: 'r', dir: -1, tgt: 12, dec: 1, prim: 'lic', sec: 'vp',
    ar: 'شكاوى المواطنين', en: 'Citizen Complaints',
    dAr: 'عدد الشكاوى البلدية لكل ١٠ آلاف نسمة خلال الفترة', dEn: 'Municipal complaints per 10,000 population in the period' },
  { id: 'sat', ic: '😊', tier: 's', u: '%', dir: 1, tgt: 78, dec: 1, prim: 'svc', sec: null,
    ar: 'رضا المواطنين', en: 'Citizen Satisfaction',
    dAr: 'مؤشر رضا المواطن عن الخدمات الرقابية البلدية', dEn: 'Citizen satisfaction index for municipal regulatory services' },
];
const K = {}; KPIS.forEach(k => K[k.id] = k);

/* ---------- dimension sets ---------- */
const DIMS = {
  lic: {
    ar: 'نوع النشاط / الرخصة', en: 'Activity / License type',
    items: [
      { k: 'retail', ar: 'الرخص التجارية', en: 'Retail', w: .32, ax: 'commercial' },
      { k: 'health', ar: 'الرخص الصحية', en: 'Health', w: .16, ax: 'health' },
      { k: 'construction', ar: 'الرخص الإنشائية', en: 'Construction', w: .22, ax: 'construction' },
      { k: 'excavation', ar: 'الحفريات', en: 'Excavation', w: .18, ax: 'excavation' },
      { k: 'group', ar: 'الإسكان الجماعي', en: 'Group Accommodation', w: .12, ax: 'group' },
    ]
  },
  org: {
    ar: 'المستوى التنظيمي', en: 'Organisational level',
    items: [
      { k: 'amana', ar: 'الأمانة', en: 'Amana', w: .40, off: 2.4 },
      { k: 'city', ar: 'البلدية / المدينة', en: 'City municipality', w: .35, off: -.6 },
      { k: 'district', ar: 'البلدية الفرعية / الحي', en: 'District municipality', w: .25, off: -3.6 },
    ]
  },
  svc: {
    ar: 'الخدمة الرقابية', en: 'Regulatory service',
    items: [
      { k: 'lic', ar: 'إصدار وتجديد الرخص', en: 'Licensing', w: .3, off: 3.1 },
      { k: 'insp', ar: 'الزيارات التفتيشية', en: 'Inspection visits', w: .22, off: -1.2 },
      { k: 'cmp', ar: 'معالجة البلاغات', en: 'Complaint handling', w: .28, off: -4.4 },
      { k: 'vp', ar: 'إزالة التشوه البصري', en: 'VP removal', w: .2, off: -2.6 },
    ]
  },
};
/* vp dim set is built from the official taxonomy in SEED */
function buildVpDims() {
  const w = [.30, .26, .18, .14, .12];
  DIMS.vp = { ar: 'عنصر التشوه البصري', en: 'Visual-pollution element',
    items: SEED.vp.map((m, i) => ({ k: 'vp' + i, ar: m.ar, en: m.en, w: w[i], subs: m.subs, ent: m.ent })) };
}

/* ---------- unit tree ---------- */

/* --- source lines 2671-2830 --- */
const CITY_LL = {
  'الرياض': [24.713, 46.675], 'الخرج': [24.148, 47.305], 'الدوادمي': [24.507, 44.392], 'المجمعة': [25.907, 45.345],
  'الزلفي': [26.297, 44.814], 'وادي الدواسر': [20.478, 44.797], 'بريدة': [26.359, 43.981], 'عنيزة': [26.088, 43.994],
  'الرس': [25.869, 43.503], 'المذنب': [25.867, 44.221], 'تبوك': [28.383, 36.566], 'ضباء': [27.352, 35.696],
  'الوجه': [26.235, 36.464], 'أملج': [25.049, 37.264], 'المدينة المنورة': [24.470, 39.612], 'ينبع': [24.089, 38.061],
  'العلا': [26.609, 37.922], 'بدر': [23.780, 38.790], 'مكة المكرمة': [21.423, 39.826], 'جدة': [21.543, 39.173],
  'الطائف': [21.271, 40.416], 'رابغ': [22.799, 39.035], 'القنفذة': [19.128, 41.079], 'عرعر': [30.983, 41.039],
  'رفحاء': [29.632, 43.500], 'طريف': [31.677, 38.663], 'سكاكا': [29.970, 40.207], 'القريات': [31.332, 37.343],
  'دومة الجندل': [29.809, 39.869], 'حائل': [27.521, 41.691], 'بقعاء': [27.876, 42.783], 'الغزالة': [26.867, 41.483],
  'الباحة': [20.013, 41.468], 'بلجرشي': [19.858, 41.562], 'المندق': [20.166, 41.290], 'جازان': [16.889, 42.551],
  'صبيا': [17.149, 42.626], 'أبو عريش': [16.969, 42.832], 'فرسان': [16.702, 42.117], 'أبها': [18.216, 42.505],
  'خميس مشيط': [18.301, 42.729], 'بيشة': [19.996, 42.594], 'النماص': [19.150, 42.121], 'نجران': [17.492, 44.132],
  'شرورة': [17.487, 47.113], 'حبونا': [17.822, 44.203], 'الدمام': [26.434, 50.104], 'الخبر': [26.279, 50.209],
  'الأحساء': [25.383, 49.589], 'الجبيل': [27.005, 49.658], 'القطيف': [26.565, 49.996], 'حفر الباطن': [28.434, 45.970],
};
const POPW = {
  'Riyadh': [.815, .050, .014, .009, .008, .013], 'Makkah': [.29, .47, .155, .035, .05],
  'Eastern Region': [.30, .175, .275, .11, .085, .055], 'Madinah': [.62, .22, .09, .07],
  'Asir': [.34, .38, .17, .11], 'Qassim': [.52, .22, .16, .10], 'Jizan': [.36, .27, .24, .13],
  'Tabuk': [.62, .16, .13, .09], 'Hail': [.66, .19, .15], 'Najran': [.66, .21, .13],
  'Jawf': [.48, .34, .18], 'Bahah': [.47, .32, .21], 'Northern Region': [.58, .25, .17],
};
const U = {};          // id -> unit
let KSA, REGIONS = [], CITIES = [], DISTRICTS = [];

function buildUnits() {
  KSA = { id: 'KSA', lvl: 0, ar: 'المملكة العربية السعودية', en: 'Kingdom of Saudi Arabia', ch: [], pop: 0, c: [24.0, 45.0] };
  U.KSA = KSA;
  SEED.regions.forEach(r => {
    const u = { id: r.id, lvl: 1, ar: r.ar, en: r.en, c: r.c, pop: r.pop, comp: r.comp, ax: r.ax, geo: r.geo, cap: r.cap, p: 'KSA', ch: [] };
    U[u.id] = u; REGIONS.push(u); KSA.ch.push(u.id); KSA.pop += u.pop;
  });
  SEED.cities.forEach((c, i) => {
    const p = U[c.p], sib = SEED.cities.filter(x => x.p === c.p), k = sib.indexOf(c);
    const w = (POPW[p.geo] || sib.map(() => 1 / sib.length))[k] || .05;
    const u = { id: c.id, lvl: 2, ar: c.ar, en: c.en, p: c.p, comp: c.comp, ch: [],
      pop: Math.round(p.pop * w), c: CITY_LL[c.ar] || [p.c[0] + jit(c.id + 'la', .7), p.c[1] + jit(c.id + 'lo', .8)] };
    U[u.id] = u; CITIES.push(u); p.ch.push(u.id);
  });
  const RCITY = U['C:Riyadh/الرياض'];
  SEED.districts.forEach(d => {
    const u = { id: d.id, lvl: 3, ar: d.ar, en: d.en, p: RCITY.id, c: d.c, pop: d.pop, comp: d.comp, ax: d.ax, ch: [] };
    U[u.id] = u; DISTRICTS.push(u); RCITY.ch.push(u.id);
  });
  // district population is real: use it as the Riyadh-city weight base
  RCITY.dpop = DISTRICTS.reduce((s, d) => s + d.pop, 0);
}

/* ---------- leaf profiles ---------- */
/* axes: health / commercial / construction / excavation / distortion  x  compliance / enforcement / coverage */
function axOf(u) {
  if (u.ax) return u.ax;                       // regions + Riyadh districts carry real profiles
  const p = U[u.p], pa = axOf(p), d = (u.comp - p.comp) * 0.9, o = {};
  for (const a in pa) { o[a] = {}; for (const i in pa[a]) o[a][i] = clamp(pa[a][i] + d + jit(u.id + a + i, 4.5), 34, 97); }
  u.ax = o; return o;
}
/* targeted structural penalties that create the demo's real storylines */
function penalty(u, kpi, dimK) {
  let p = 0;
  const inRiyadh = u.id.indexOf('D:') === 0 || u.id === 'C:Riyadh/الرياض';
  if (inRiyadh && dimK === 'excavation') p -= (kpi === 'comp' ? 15 : kpi === 'cov' ? 12 : kpi === 'enf' ? 10 : 0);
  if (inRiyadh && dimK === 'construction') p -= (kpi === 'cov' ? 6 : 3);
  const reg = regionOf(u);
  if (reg && (reg.geo === 'Jizan' || reg.geo === 'Asir') && dimK === 'group') p -= (kpi === 'comp' ? 13 : kpi === 'cov' ? 15 : 8);
  if (reg && reg.geo === 'Makkah' && dimK === 'vp1') p -= (kpi === 'vpenf' ? 12 : 5);
  return p;
}
function regionOf(u) { while (u && u.lvl > 1) u = U[u.p]; return u && u.lvl === 1 ? u : null; }

const _c = {};
/* raw (period-agnostic, "today") value of kpi at unit, for a dimension key or overall */
function raw(uid, kpi, dimK) {
  const key = uid + '|' + kpi + '|' + (dimK || '');
  if (_c[key] !== undefined) return _c[key];
  const u = U[uid]; let v;
  if (u.ch.length) {                                        // aggregate = population-weighted mean of children
    let sw = 0, s = 0;
    u.ch.forEach(cid => { const w = U[cid].pop; sw += w; s += w * raw(cid, kpi, dimK); });
    v = sw ? s / sw : 0;
  } else v = leaf(u, kpi, dimK);
  _c[key] = v; return v;
}
/* seeded, normalised share vector over a dim set (used for complaint volumes) */
const CXSH = { retail: .34, health: .11, construction: .22, excavation: .17, group: .16 };
function shareOf(u, setName, dimK, tag, boost) {
  const set = DIMS[setName], base = {};
  set.items.forEach(it => {
    let b = setName === 'lic' ? CXSH[it.k] : it.w;
    b *= 1 + jit(u.id + tag + it.k, .22);
    if (boost && boost.k === it.k) b *= boost.m;
    base[it.k] = Math.max(.01, b);
  });
  const tot = Object.values(base).reduce((a, b) => a + b, 0);
  return 100 * base[dimK] / tot;
}
const KLIFT = { comp: 4.2, cov: 9.1, enf: 1.2, vpenf: 0 };
function leaf(u, kpi, dimK) {
  const kd = K[kpi], set = DIMS[kd.prim];
  const ax0 = axOf(u);
  if (kpi === 'cx') {
    const cmp = (ax0.commercial.compliance + ax0.distortion.compliance + ax0.commercial.enforcement) / 3;
    const rate = clamp(29 - .235 * cmp + jit(u.id + 'cx', 1.7), 3.4, 27);
    if (!dimK) return rate;
    const inR = u.id.indexOf('D:') === 0;
    if (DIMS.lic.items.some(x => x.k === dimK)) return shareOf(u, 'lic', dimK, 'cxl', inR ? { k: 'excavation', m: 1.9 } : null);
    if (/^vp\d$/.test(dimK)) return shareOf(u, 'vp', dimK, 'cxv', null);
    if (DIMS.org.items.some(x => x.k === dimK)) return shareOf(u, 'org', dimK, 'cxo', null);
    return rate;
  }
  if (!dimK) { let s = 0, sw = 0; set.items.forEach(it => { s += it.w * leaf(u, kpi, it.k); sw += it.w; }); return s / sw; }
  const ax = ax0, P = penalty(u, kpi, dimK);
  const axv = (a, i) => a === 'group' ? (ax.health[i] + ax.commercial[i]) * .5 - 4 : ax[a][i];
  const item = set.items.find(x => x.k === dimK) || (DIMS[kd.sec] ? DIMS[kd.sec].items.find(x => x.k === dimK) : null) ||
               DIMS.org.items.find(x => x.k === dimK) || DIMS.svc.items.find(x => x.k === dimK) ||
               (DIMS.vp ? DIMS.vp.items.find(x => x.k === dimK) : null);
  const isLic = DIMS.lic.items.some(x => x.k === dimK), isVp = /^vp\d$/.test(dimK),
        isOrg = DIMS.org.items.some(x => x.k === dimK), isSvc = DIMS.svc.items.some(x => x.k === dimK);
  const base = () => { let s = 0, sw = 0; DIMS[kd.prim].items.forEach(it => { s += it.w * leaf(u, kpi, it.k); sw += it.w; }); return s / sw; };
  const ind = kpi === 'comp' ? 'compliance' : kpi === 'cov' ? 'coverage' : 'enforcement';
  switch (kpi) {
    case 'comp': case 'cov': case 'enf': {
      const LF = KLIFT[kpi] || 0;
      if (isLic) return clamp(axv(item.ax, ind) + LF + P + jit(u.id + kpi + dimK, 2.2), 28, 98);
      if (isVp) return clamp(ax.distortion[ind] + LF + P + jit(u.id + kpi + dimK, 6), 26, 97);
      if (isOrg) return clamp(base() + item.off + jit(u.id + kpi + dimK, 1.8), 26, 98);
      return base();
    }
    case 'vpenf': {
      if (isVp) return clamp(ax.distortion.enforcement + P + jit(u.id + 've' + dimK, 7.5), 24, 96);
      if (isOrg) return clamp(base() + item.off + jit(u.id + 'veo' + dimK, 2), 24, 97);
      return base();
    }
    case 'ttl': {
      const cmp = (ax.commercial.compliance + ax.construction.compliance + ax.health.compliance) / 3;
      const b = clamp(21.5 - .17 * cmp + jit(u.id + 'ttl', 1.1), 2.6, 19);
      const mult = { retail: .62, health: .84, construction: 1.62, excavation: 1.22, group: 1.38 };
      if (isLic) return clamp(b * mult[dimK] * (1 + jit(u.id + 'tl' + dimK, .12)) - P * .06, 1.6, 26);
      if (isOrg) { const bb = base(); return clamp(bb * (dimK === 'amana' ? 1.14 : dimK === 'city' ? .99 : .86) + jit(u.id + 'to' + dimK, .4), 1.4, 27); }
      return b;
    }
    case 'uin': case 'uio': {
      const cmp = (ax.construction.compliance + ax.distortion.compliance) / 2;
      const b = kpi === 'uin' ? clamp(56 + .46 * cmp + jit(u.id + 'uin', 3.4), 55, 98)
                              : clamp(21 + .60 * cmp + jit(u.id + 'uio', 4.2), 26, 88);
      if (isOrg) return clamp(b + item.off * 1.5 + jit(u.id + kpi + dimK, 2.4), 20, 99);
      return b;
    }
    case 'sat': {
      const cmp = (ax.commercial.compliance + ax.distortion.enforcement + ax.health.compliance) / 3;
      const b = clamp(38 + .52 * cmp + jit(u.id + 'sat', 3.1), 38, 93);
      if (isSvc) return clamp(b + item.off + jit(u.id + 'sv' + dimK, 3.6), 30, 96);
      return b;
    }
  }
  return 0;
}
/* complaints: absolute count for a unit */
const cxCount = uid => Math.round(raw(uid, 'cx') * U[uid].pop / 10000);

/* ---------- time series ---------- */

/* --- source lines 2831-2870 --- */
const MONTHS = (() => { const a = [], st = new Date(2025, 2, 1); for (let i = 0; i < 18; i++) { const d = new Date(2025, 2 + i, 1); a.push({ y: d.getFullYear(), m: d.getMonth() }); } return a; })();
const MN_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const MN_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const mLabel = i => (LANG === 'ar' ? MN_AR[MONTHS[i].m] : MN_EN[MONTHS[i].m]) + ' ' + MONTHS[i].y;
let PER = 17;                                  // selected period index

/* storyline shocks: adverse movement concentrated in the last 3 months */
const SHOCK = { 'KSA|comp': 1.5, 'KSA|cov': 1.7, 'R:Riyadh|comp': 4.6, 'R:Riyadh|cov': 5.2, 'R:Riyadh|enf': 3.1,
  'C:Riyadh/الرياض|comp': 5.6, 'C:Riyadh/الرياض|cov': 6.4, 'C:Riyadh/الرياض|enf': 3.8, 'C:Riyadh/الرياض|cx': 2.4,
  'R:Jizan|comp': 3.9, 'R:Asir|cov': 4.4, 'R:Makkah|vpenf': 4.8, 'C:Makkah/جدة|vpenf': 6.1, 'KSA|vpenf': 1.4 };

const _s = {};
function series(uid, kpi, dimK) {
  const key = uid + '|' + kpi + '|' + (dimK || '');
  if (_s[key]) return _s[key];
  const kd = K[kpi], now = raw(uid, kpi, dimK), r = rng(key + 'ser');
  const scale = kd.u === 'd' ? .55 : kd.u === 'r' ? .5 : 1;
  const trend = (r() * 2 - 1) * .42 * scale;                   // per-month drift in KPI units (+ = value rises)
  let sh = SHOCK[uid + '|' + kpi] || 0;
  if (!sh && r() < .17) sh = (1.6 + r() * 2.6) * scale;        // background degradations
  if (dimK) sh *= .8 + jit(key, .5);
  const SW = [.22, .30, .48];                                  // shock split over the last three steps
  const a = new Array(18); a[17] = now;
  for (let i = 16; i >= 0; i--) {
    const seas = Math.sin((MONTHS[i + 1].m / 12) * Math.PI * 2) * .35 * scale;
    let step = trend + (r() * 2 - 1) * .55 * scale + seas * .3;  // change from month i -> i+1
    if (i >= 14) step -= kd.dir * sh * SW[i - 14];
    a[i] = a[i + 1] - step;
  }
  const lo = kd.u === 'd' ? 1.2 : kd.u === 'r' ? 1.5 : 18, hi = kd.u === 'd' ? 30 : kd.u === 'r' ? 34 : 99.5;
  for (let i = 0; i < 18; i++) a[i] = clamp(+a[i].toFixed(2), lo, hi);
  a[17] = now;
  _s[key] = a; return a;
}
/* value at the selected period */
const at = (uid, kpi, dimK) => series(uid, kpi, dimK)[PER];
function dimVec(uid, kpi, setName) {
  const set = DIMS[setName]; if (!set) return [];
  return set.items.map(it => ({ ...it, v: at(uid, kpi, it.k) }));
}

/* --- source lines 2871-2876 --- */
/* ---------- scoring / status ---------- */
function ratio(kpi, v) { const kd = K[kpi]; return kd.dir === 1 ? v / kd.tgt : kd.tgt / Math.max(v, .1); }
function band(kpi, v) { const r = ratio(kpi, v); return r >= 1 ? 0 : r >= .95 ? 1 : r >= .88 ? 2 : r >= .78 ? 3 : 4; }
const BANDC_L = ['#0f9d63', '#48b98a', '#e0a93c', '#e07b3c', '#d85a52'];
const BANDC_D = ['#2fbf7a', '#5ccf9f', '#e5aa3c', '#ef8a4d', '#ef5f57'];
let BANDC = BANDC_L;

/* --- source lines 2901-2959 --- */
const bcol = (kpi, v) => BANDC[band(kpi, v)];
const bandKey = ['b_exc', 'b_good', 'b_fair', 'b_weak', 'b_crit'];
function fmtV(kpi, v) { const kd = K[kpi]; if (v === null || isNaN(v)) return '—'; return NF(v, kd.dec) + (kd.u === '%' ? '%' : ''); }
function unitSuffix(kpi) { const u = K[kpi].u; return u === 'd' ? T('u_day') : u === 'r' ? T('u_per10k') : ''; }
const gap = (kpi, v) => (K[kpi].dir === 1 ? v - K[kpi].tgt : K[kpi].tgt - v);   // negative = below target
function delta(uid, kpi, n) { const s = series(uid, kpi); const i = Math.max(0, PER - n); return (s[PER] - s[i]) * K[kpi].dir; }

/* ---------- children helpers ---------- */
function childrenOf(uid) { return U[uid].ch.map(id => U[id]); }
function scopeChildren(uid) {
  const u = U[uid];
  if (u.ch.length) return childrenOf(uid);
  return [];
}
/* contribution of each child to the parent's gap vs target */
function contrib(uid, kpi, dimK) {
  const ch = scopeChildren(uid); if (!ch.length) return [];
  const sw = ch.reduce((s, c) => s + c.pop, 0);
  return ch.map(c => {
    const v = at(c.id, kpi, dimK), w = c.pop / sw, g = gap(kpi, v);
    return { u: c, v, w, g, c: w * g, d3: delta(c.id, kpi, 3) };
  }).sort((a, b) => a.c - b.c);
}
/* contribution of each dimension to the unit's gap */
function dimContrib(uid, kpi, setName) {
  const set = DIMS[setName || K[kpi].prim]; if (!set) return [];
  if (kpi === 'cx') {                                 // complaints: dimensions are volume shares
    const g = gap(kpi, at(uid, 'cx'));
    return set.items.map(it => { const sh = at(uid, 'cx', it.k);
      return { it, v: sh, w: sh / 100, g, c: (sh / 100) * g, d3: delta3dim(uid, kpi, it.k), share: true };
    }).sort((a, b) => a.c - b.c);
  }
  const tw = set.items.reduce((s, i) => s + i.w, 0);
  return set.items.map(it => {
    const v = at(uid, kpi, it.k), w = it.w / tw, g = gap(kpi, v);
    return { it, v, w, g, c: w * g, d3: delta3dim(uid, kpi, it.k) };
  }).sort((a, b) => a.c - b.c);
}
/* the KPI with the worst standing at a unit (used by the AI panel) */
function worstKpi(uid) {
  return KPIS.map(k => ({ k, v: at(uid, k.id, null), r: ratio(k.id, at(uid, k.id, null)), d3: delta(uid, k.id, 3) }))
             .sort((a, b) => a.r - b.r)[0];
}
function fastestFalling(uid) {
  return KPIS.map(k => ({ k, v: at(uid, k.id, null), d1: delta(uid, k.id, 1), d3: delta(uid, k.id, 3) }))
             .sort((a, b) => a.d3 - b.d3)[0];
}
/* simple linear projection to Dec-2026 from the last 6 observed months */
function project(uid, kpi) {
  const s = series(uid, kpi), n = 6, i0 = Math.max(0, PER - n + 1);
  let sx = 0, sy = 0, sxy = 0, sxx = 0, c = 0;
  for (let i = i0; i <= PER; i++) { const x = i - i0; sx += x; sy += s[i]; sxy += x * s[i]; sxx += x * x; c++; }
  const b = (c * sxy - sx * sy) / Math.max(1e-9, (c * sxx - sx * sx)), a = (sy - b * sx) / c;
  const hz = 17 - PER + 4;                                   // months out to Dec-2026
  const p = a + b * (c - 1 + hz);
  const kd = K[kpi], lo = kd.u === 'd' ? 1.2 : kd.u === 'r' ? 1.5 : 15, hi = kd.u === 'd' ? 30 : kd.u === 'r' ? 34 : 100;
  return { slope: b, val: clamp(p, lo, hi), hz };
}
function delta3dim(uid, kpi, dimK) { const s = series(uid, kpi, dimK); return (s[PER] - s[Math.max(0, PER - 3)]) * K[kpi].dir; }

/* --- source lines 4225-4404 --- */

const SEVC = { crit: 'crit', high: 'weak', med: 'fair' };
const TYPEIC = { social: '📣', safety: '⚠', structural: '🏚', env: '♻', service: '🛠' };
const SRCIC = { x: '𝕏', tiktok: '♪', news: '📰', c940: '☎', fld: '🔍', ai: '🛰' };

/* ---------- incident register ---------- */
const INC = [
  { id: 'CE-3041', t: 'social', sev: 'crit', src: 'x', det: 6, sla: 12, st: 'st_prog', kpi: 'cx',
    ar: 'اتجاه متصاعد على وسائل التواصل: نظافة الشوارع', en: 'Rising social-media trend: street cleanliness',
    city: 'C:Riyadh/الرياض', ll: [24.706, 46.685],
    own: { ar: 'أمانة الرياض + المركز الوطني لإدارة النفايات', en: 'Riyadh Municipality + National Waste Management Center' },
    m: { mentions: 8420, d24: 186, sent: -62, reach: 1900000, scopes: ['العزيزية', 'السويدي', 'الشفا'] },
    ev: [{ ar: 'ارتفاع الإشارات من <b>2,940</b> إلى <b>8,420</b> إشارة خلال ٢٤ ساعة (+<b>186%</b>)', en: 'Mentions up from <b>2,940</b> to <b>8,420</b> in 24h (+<b>186%</b>)' },
         { ar: '<b>71%</b> من الإشارات تشير إلى ثلاثة أحياء جنوب الرياض', en: '<b>71%</b> of mentions point to three districts in south Riyadh' },
         { ar: 'ارتباط مع <b>1,284</b> بلاغًا بلديًا عن النظافة في نفس النطاق خلال ٧ أيام', en: 'Correlates with <b>1,284</b> municipal cleanliness reports in the same scope over 7 days' }],
    acts: [{ h: 6, ar: 'رصد آلي لارتفاع الإشارات وفتح حدث حرج', en: 'Automated spike detection, critical event opened' },
           { h: 5, ar: 'فرز وتأكيد الموقع الجغرافي للإشارات', en: 'Triaged and geo-confirmed the signal cluster' },
           { h: 3, ar: 'إحالة إلى عمليات الأمانة والمركز الوطني لإدارة النفايات', en: 'Referred to municipal operations and NWMC' },
           { h: 1, ar: 'نشر ٦ فرق نظافة إضافية ودورتين مسائيتين', en: 'Six additional cleaning crews and two evening cycles deployed' }],
    reco: [{ ar: 'دورة نظافة مكثفة في الأحياء الثلاثة خلال ٢٤ ساعة مع تحقق مصوّر', en: 'Intensive cleaning cycle in the three districts within 24h with photo verification' },
           { ar: 'رد رسمي على المنصة يوضح الجدول الزمني للمعالجة', en: 'Official platform response setting out the remediation timeline' },
           { ar: 'خصم تعاقدي على مقاول النظافة للمواقع المتكررة', en: 'Contractual deduction on the cleaning contractor for repeat locations' }] },

  { id: 'CE-3042', t: 'social', sev: 'high', src: 'tiktok', det: 14, sla: 24, st: 'st_assign', kpi: 'enf',
    ar: 'اتجاه: الباعة الجائلون وإشغال الأرصفة', en: 'Trend: street vendors occupying sidewalks',
    city: 'C:Makkah/جدة', ll: [21.487, 39.187],
    own: { ar: 'أمانة جدة — الإنفاذ + الإدارة العامة للمرور', en: 'Jeddah Municipality — Enforcement + General Directorate of Traffic' },
    m: { mentions: 3180, d24: 94, sent: -48, reach: 640000, scopes: ['البلد', 'الكورنيش', 'الشرفية'] },
    ev: [{ ar: '<b>3,180</b> إشارة و<b>41</b> مقطعًا مصورًا لإشغال الأرصفة والوقوف المزدوج', en: '<b>3,180</b> mentions and <b>41</b> videos of sidewalk occupation and double parking' },
         { ar: '<b>62%</b> من المقاطع في محيط ثلاث أسواق شعبية', en: '<b>62%</b> of the clips are around three popular markets' },
         { ar: '<b>96</b> مخالفة بيع جائل مرصودة في النطاق خلال ٣٠ يومًا', en: '<b>96</b> street-vending violations recorded in the scope over 30 days' }],
    acts: [{ h: 14, ar: 'رصد الاتجاه وربطه بسجل المخالفات', en: 'Trend detected and matched to the violation register' },
           { h: 9, ar: 'إحالة إلى الإنفاذ البلدي بالتنسيق مع المرور', en: 'Referred to municipal enforcement with Traffic' },
           { h: 4, ar: 'جدولة ضبط ميداني مشترك في الأوقات المسائية', en: 'Joint evening field control scheduled' }],
    reco: [{ ar: 'ضبط ميداني مشترك ثلاث ليالٍ متتالية في الأسواق الثلاثة', en: 'Joint field control on three consecutive nights at the three markets' },
           { ar: 'تخصيص موقع بيع منظم بديل قريب', en: 'Designate a nearby regulated vending area' },
           { ar: 'حصر وتنظيم الوقوف على مسارات المشاة', en: 'Survey and regulate parking on pedestrian routes' }] },

  { id: 'CE-3043', t: 'env', sev: 'crit', src: 'ai', det: 26, sla: 24, st: 'st_hold', kpi: 'enf',
    ar: 'طمر نفايات خارج المرادم النظامية', en: 'Waste dumping outside licensed landfills',
    city: 'C:Riyadh/الرياض', ll: [24.552, 46.912],
    own: { ar: 'المركز الوطني لإدارة النفايات + الأمانة', en: 'National Waste Management Center + Municipality' },
    m: { mentions: 640, d24: 22, sent: -55, reach: 120000, scopes: ['شرق الرياض', 'الدمام', 'جدة'] },
    ev: [{ ar: 'رصد <b>14</b> موقع طمر غير نظامي عبر صور الأقمار الصناعية، <b>6</b> منها نشطة', en: '<b>14</b> unlicensed dump sites detected from satellite imagery, <b>6</b> still active' },
         { ar: 'مساحة متأثرة تقديرية <b>38</b> هكتارًا خارج النطاق العمراني', en: 'Estimated <b>38</b> hectares affected outside the urban boundary' },
         { ar: '<b>22</b> رحلة شاحنة مرصودة ليلًا دون تصريح نقل مخلفات', en: '<b>22</b> night truck movements detected without a waste-transport permit' }],
    acts: [{ h: 20, ar: 'رصد آلي من صور الأقمار الصناعية وفتح الحدث', en: 'Automated satellite detection, event opened' },
           { h: 16, ar: 'تحقق ميداني من ٦ مواقع نشطة', en: 'Field verification of six active sites' },
           { h: 8, ar: 'إحالة إلى المركز الوطني لإدارة النفايات — بانتظار قرار الإزالة', en: 'Referred to NWMC — awaiting removal decision' }],
    reco: [{ ar: 'إيقاف نشاط الناقلين غير المصرح لهم وضبط الشاحنات', en: 'Suspend unlicensed hauliers and impound trucks' },
           { ar: 'تسييج المواقع النشطة ومراقبتها بالكاميرات المتنقلة', en: 'Fence active sites and monitor with mobile cameras' },
           { ar: 'خطة إعادة تأهيل للمواقع الأربعة الأكبر', en: 'Rehabilitation plan for the four largest sites' }] },

  { id: 'CE-3044', t: 'safety', sev: 'crit', src: 'c940', det: 3, sla: 6, st: 'st_prog', kpi: 'cov',
    ar: 'خلل في سلامة ألعاب مدينة ترفيهية للأطفال', en: 'Safety failure at a children’s amusement park',
    city: 'C:Makkah/الطائف', ll: [21.272, 40.418],
    own: { ar: 'أمانة الطائف — رقابة المنشآت الترفيهية + الدفاع المدني', en: 'Taif Municipality — Recreational Facilities Control + Civil Defense' },
    m: { mentions: 1420, d24: 210, sent: -74, reach: 380000, scopes: ['الطائف'] },
    ev: [{ ar: '<b>3</b> ألعاب تعمل دون شهادة فحص سلامة سارية', en: '<b>3</b> rides operating without a valid safety inspection certificate' },
         { ar: 'إصابة طفل واحدة مُبلَّغ عنها ونقل للمستشفى — حالة مستقرة', en: 'One reported child injury, transferred to hospital — stable' },
         { ar: 'آخر زيارة تفتيشية قبل <b>214</b> يومًا مقابل دورة <b>90</b> يومًا', en: 'Last inspection <b>214</b> days ago against a <b>90</b>-day cycle' }],
    acts: [{ h: 3, ar: 'بلاغ ٩٤٠ وتصنيفه حدثًا حرجًا', en: '940 report received and classified critical' },
           { h: 2.5, ar: 'إيقاف فوري للألعاب الثلاث وإخلاء المنطقة', en: 'Immediate suspension of the three rides and area evacuation' },
           { h: 2, ar: 'تفتيش مشترك مع الدفاع المدني', en: 'Joint inspection with Civil Defense' },
           { h: .5, ar: 'إيقاف نشاط المنشأة حتى استكمال الفحص الفني', en: 'Facility activity suspended pending technical clearance' }],
    reco: [{ ar: 'إغلاق إداري حتى صدور شهادات الفحص لكل الألعاب', en: 'Administrative closure until certificates are issued for every ride' },
           { ar: 'حصر عاجل لكل مدن الألعاب في المنطقة وتفتيشها خلال ٧ أيام', en: 'Urgent inventory and inspection of all amusement parks in the region within 7 days' },
           { ar: 'ربط تجديد الرخصة بشهادة فحص سلامة سارية إلكترونيًا', en: 'Tie licence renewal to a digitally verified safety certificate' }] },

  { id: 'CE-3045', t: 'structural', sev: 'crit', src: 'news', det: 9, sla: 8, st: 'st_prog', kpi: 'uio',
    ar: 'سقوط أجزاء من مبنى قائم', en: 'Partial collapse of an existing building',
    city: 'C:Makkah/جدة', ll: [21.516, 39.176],
    own: { ar: 'أمانة جدة — السلامة الإنشائية + الدفاع المدني', en: 'Jeddah Municipality — Structural Safety + Civil Defense' },
    m: { mentions: 5960, d24: 320, sent: -70, reach: 1250000, scopes: ['الشرفية'] },
    ev: [{ ar: 'مبنى سكني قائم منذ <b>1979</b> — سقوط أجزاء من الواجهة على الرصيف', en: 'Residential building dating to <b>1979</b> — façade sections fell onto the sidewalk' },
         { ar: '<b>2</b> إنذارات سابقة بشأن التهالك دون معالجة موثقة', en: '<b>2</b> prior dilapidation notices with no documented remediation' },
         { ar: 'إخلاء <b>11</b> أسرة وإغلاق جزئي للشارع', en: '<b>11</b> households evacuated and the street partially closed' }],
    acts: [{ h: 9, ar: 'بلاغ إعلامي وميداني وفتح الحدث', en: 'Media and field report, event opened' },
           { h: 8, ar: 'تطويق الموقع وإخلاء السكان', en: 'Site cordoned and residents evacuated' },
           { h: 6, ar: 'تقييم إنشائي عاجل — المبنى غير آمن للسكن', en: 'Urgent structural assessment — building unfit for occupancy' },
           { h: 2, ar: 'إحالة لقرار الإزالة وتعويض السكن البديل', en: 'Referred for demolition decision and alternative housing' }],
    reco: [{ ar: 'إزالة عاجلة على حساب المالك مع تأمين السكن البديل', en: 'Urgent demolition at owner cost with alternative housing secured' },
           { ar: 'إعادة فحص المباني المُنذرة سابقًا في الحي نفسه (<b>34</b> مبنى)', en: 'Re-inspect previously notified buildings in the same district (<b>34</b> buildings)' },
           { ar: 'تحويل الإنذارات غير المعالجة إلى أوامر عمل ملزمة', en: 'Convert unresolved notices into binding work orders' }] },

  { id: 'CE-3046', t: 'service', sev: 'high', src: 'c940', det: 11, sla: 12, st: 'st_assign', kpi: 'comp',
    ar: 'تسرب مياه وتآكل طبقة الأسفلت', en: 'Water leak eroding the road surface',
    city: 'C:Riyadh/الرياض', ll: [24.822, 46.612],
    own: { ar: 'الأمانة + الهيئة السعودية للمياه', en: 'Municipality + Saudi Water Authority' },
    m: { mentions: 410, d24: 36, sent: -40, reach: 82000, scopes: ['الملقا'] },
    ev: [{ ar: 'تسرب مستمر منذ <b>4</b> أيام وهبوط جزئي في مسار مروري', en: 'Leak running for <b>4</b> days with partial subsidence in one lane' },
         { ar: '<b>3</b> بلاغات متكررة على نفس الموقع دون معالجة جذرية', en: '<b>3</b> repeat reports on the same location with no permanent fix' }],
    acts: [{ h: 11, ar: 'استلام البلاغ وتحديد الموقع', en: 'Report received and located' },
           { h: 6, ar: 'إحالة إلى الجهة الخدمية مع طلب تنسيق حفر عاجل', en: 'Referred to the utility with an urgent excavation coordination request' }],
    reco: [{ ar: 'إصلاح التسرب وإعادة الوضع لأصله خلال ٤٨ ساعة', en: 'Repair the leak and reinstate within 48 hours' },
           { ar: 'ربط الإفراج عن الضمان باكتمال إعادة الوضع', en: 'Tie guarantee release to verified reinstatement' }] },

  { id: 'CE-3047', t: 'safety', sev: 'high', src: 'ai', det: 7, sla: 12, st: 'st_triage', kpi: 'vpenf',
    ar: 'سقوط لوحة إعلانية على رصيف', en: 'Advertising board collapsed onto a sidewalk',
    city: 'C:Eastern Region/الدمام', ll: [26.418, 50.098],
    own: { ar: 'الأمانة — الاستثمار والسلامة', en: 'Municipality — Investment & Safety' },
    m: { mentions: 730, d24: 58, sent: -52, reach: 96000, scopes: ['الدمام'] },
    ev: [{ ar: 'رصد آلي من كاميرات الشوارع — لا إصابات', en: 'Automated street-camera detection — no injuries' },
         { ar: '<b>18</b> لوحة مماثلة في المدينة تجاوزت عمر الفحص الدوري', en: '<b>18</b> similar boards in the city are past their inspection cycle' }],
    acts: [{ h: 7, ar: 'رصد آلي وتأمين الموقع', en: 'Automated detection, site secured' },
           { h: 4, ar: 'فرز وطلب حصر اللوحات المماثلة', en: 'Triaged, inventory of similar boards requested' }],
    reco: [{ ar: 'فحص فوري للـ<b>18</b> لوحة وإزالة غير المطابقة', en: 'Immediate inspection of the <b>18</b> boards and removal of non-compliant ones' },
           { ar: 'إلزام المستثمر بشهادة سلامة إنشائية سنوية', en: 'Require an annual structural safety certificate from the investor' }] },

  { id: 'CE-3048', t: 'safety', sev: 'high', src: 'fld', det: 27, sla: 24, st: 'st_prog', kpi: 'comp',
    ar: 'حالات تسمم غذائي مشتبه بها في مطعم', en: 'Suspected food-poisoning cases at a restaurant',
    city: 'C:Madinah/المدينة المنورة', ll: [24.468, 39.615],
    own: { ar: 'الأمانة — الصحة العامة', en: 'Municipality — Public Health' },
    m: { mentions: 1180, d24: 88, sent: -66, reach: 240000, scopes: ['المدينة المنورة'] },
    ev: [{ ar: '<b>5</b> حالات مُبلَّغ عنها خلال ٢٤ ساعة من منشأة واحدة', en: '<b>5</b> cases reported within 24 hours from a single establishment' },
         { ar: 'مخالفات سابقة: <b>2</b> إنذار على سلسلة التبريد', en: 'Prior violations: <b>2</b> notices on the chill chain' }],
    acts: [{ h: 16, ar: 'إغلاق مؤقت وسحب عينات للمختبر', en: 'Temporary closure and laboratory sampling' },
           { h: 10, ar: 'تفتيش شامل على فروع المنشأة الأخرى', en: 'Full inspection of the operator’s other branches' }],
    reco: [{ ar: 'الإغلاق حتى نتائج المختبر وإعادة تأهيل العاملين', en: 'Keep closed pending lab results and re-certify staff' },
           { ar: 'برنامج امتثال ملزم للمنشآت متكررة المخالفة', en: 'Mandatory compliance programme for repeat offenders' }] },

  { id: 'CE-3049', t: 'structural', sev: 'high', src: 'ai', det: 30, sla: 48, st: 'st_assign', kpi: 'uio',
    ar: 'مبنى آيل للسقوط في نطاق مأهول', en: 'Building at risk of collapse in a populated area',
    city: 'C:Makkah/مكة المكرمة', ll: [21.409, 39.842],
    own: { ar: 'أمانة العاصمة المقدسة — السلامة الإنشائية', en: 'Makkah Municipality — Structural Safety' },
    m: { mentions: 520, d24: 14, sent: -44, reach: 74000, scopes: ['المسفلة'] },
    ev: [{ ar: 'رصد ميل وتشققات من صور المسح الجوي', en: 'Tilt and cracking detected from aerial survey imagery' },
         { ar: 'المبنى داخل نطاق كثافة سكانية عالية', en: 'The building sits inside a high-density residential block' }],
    acts: [{ h: 30, ar: 'رصد آلي وإحالة للتقييم الإنشائي', en: 'Automated detection referred for structural assessment' },
           { h: 12, ar: 'زيارة تقييم أولية — يُمنع الاستخدام', en: 'Initial assessment visit — use prohibited' }],
    reco: [{ ar: 'إخلاء وتسييج ثم إزالة وفق الجدول العاجل', en: 'Evacuate, hoard, then demolish on the urgent schedule' },
           { ar: 'مسح جوي لكل الحي لتحديد المباني المماثلة', en: 'Aerial sweep of the whole district to find similar buildings' }] },

  { id: 'CE-3050', t: 'env', sev: 'high', src: 'c940', det: 26, sla: 36, st: 'st_prog', kpi: 'cx',
    ar: 'انسداد شبكة تصريف مياه الأمطار', en: 'Storm-drainage network blockage',
    city: 'C:Jizan/جازان', ll: [16.892, 42.556],
    own: { ar: 'الأمانة — التشغيل والصيانة', en: 'Municipality — Operations & Maintenance' },
    m: { mentions: 860, d24: 40, sent: -50, reach: 130000, scopes: ['جازان'] },
    ev: [{ ar: '<b>7</b> نقاط تجمع مياه على طرق رئيسة', en: '<b>7</b> ponding points on primary roads' },
         { ar: 'توقعات أمطار خلال <b>48</b> ساعة', en: 'Rainfall forecast within <b>48</b> hours' }],
    acts: [{ h: 26, ar: 'بلاغات متعددة وفتح حدث موحد', en: 'Multiple reports consolidated into one event' },
           { h: 14, ar: 'نشر معدات شفط وتنظيف المصافي', en: 'Vacuum units deployed and gullies cleared' }],
    reco: [{ ar: 'تنظيف الشبكة في النقاط السبع قبل موجة الأمطار', en: 'Clear the network at all seven points before the rain event' },
           { ar: 'خطة استجابة مسبقة لموسم الأمطار', en: 'Pre-positioned response plan for the rainy season' }] },

  { id: 'CE-3051', t: 'social', sev: 'med', src: 'x', det: 34, sla: 48, st: 'st_triage', kpi: 'vpenf',
    ar: 'اتجاه: اللوحات العشوائية والتشوه البصري', en: 'Trend: unregulated signage and visual pollution',
    city: 'C:Asir/أبها', ll: [18.219, 42.508],
    own: { ar: 'أمانة عسير — الاستثمار', en: 'Asir Municipality — Investment' },
    m: { mentions: 1240, d24: 46, sent: -38, reach: 210000, scopes: ['أبها', 'خميس مشيط'] },
    ev: [{ ar: '<b>1,240</b> إشارة مع صور لواجهات ولوحات غير مطابقة', en: '<b>1,240</b> mentions with photos of non-compliant façades and signage' },
         { ar: 'تزامن مع موسم سياحي مرتفع الزيارة', en: 'Coincides with a high-visitation tourism season' }],
    acts: [{ h: 34, ar: 'رصد الاتجاه وتصنيفه متوسط الخطورة', en: 'Trend detected and classified medium severity' }],
    reco: [{ ar: 'حملة تصحيح لوحات على الشوارع السياحية الرئيسة', en: 'Signage correction campaign on the main tourism streets' },
           { ar: 'مهلة تصحيح ٢١ يومًا قبل الإنفاذ', en: '21-day correction window before enforcement' }] },

  { id: 'CE-3052', t: 'service', sev: 'med', src: 'ai', det: 41, sla: 72, st: 'st_assign', kpi: 'cov',
    ar: 'عطل إنارة في نفق مروري', en: 'Lighting failure in a road tunnel',
    city: 'C:Riyadh/الرياض', ll: [24.688, 46.721],
    own: { ar: 'الأمانة — الإنارة', en: 'Municipality — Lighting' },
    m: { mentions: 320, d24: 12, sent: -30, reach: 54000, scopes: ['الرياض'] },
    ev: [{ ar: '<b>26</b> وحدة إنارة متعطلة من أصل <b>60</b>', en: '<b>26</b> of <b>60</b> lighting units out of service' }],
    acts: [{ h: 41, ar: 'رصد آلي من نظام الإنارة الذكية', en: 'Detected by the smart-lighting system' },
           { h: 20, ar: 'إحالة لعقد الصيانة', en: 'Referred to the maintenance contract' }],
    reco: [{ ar: 'استبدال الوحدات خلال ٧٢ ساعة مع فحص اللوحة الكهربائية', en: 'Replace units within 72 hours and check the distribution board' }] },

  { id: 'CE-3053', t: 'safety', sev: 'med', src: 'c940', det: 44, sla: 72, st: 'st_prog', kpi: 'comp',
    ar: 'حفرية دون تسييج قرب مدرسة', en: 'Unfenced excavation next to a school',
    city: 'C:Qassim/بريدة', ll: [26.352, 43.975],
    own: { ar: 'الأمانة + الجهات الخدمية', en: 'Municipality + Utility providers' },
    m: { mentions: 260, d24: 9, sent: -46, reach: 38000, scopes: ['بريدة'] },
    ev: [{ ar: 'حفرية على مسار مشاة تستخدمه مدرسة ابتدائية', en: 'Excavation on a footpath used by a primary school' },
         { ar: 'تصريح الحفر منتهٍ منذ <b>9</b> أيام', en: 'Excavation permit expired <b>9</b> days ago' }],
    acts: [{ h: 44, ar: 'بلاغ من الحي وتأمين مؤقت', en: 'Neighbourhood report, temporary securing' },
           { h: 18, ar: 'إشعار الجهة الخدمية بإيقاف الأعمال', en: 'Utility notified to stop works' }],
    reco: [{ ar: 'تسييج نظامي فوري ومسار مشاة بديل آمن', en: 'Immediate compliant hoarding and a safe alternative footpath' },
           { ar: 'غرامة على الجهة المنفذة وإعادة الوضع لأصله', en: 'Fine the contractor and require reinstatement' }] },
];
INC.forEach(i => { i.risk = Math.round(clamp((i.sev === 'crit' ? 68 : i.sev === 'high' ? 48 : 28)
  + Math.min(12, i.m.d24 / 18) + (i.det > i.sla ? 8 : 0) + Math.log10(Math.max(10, i.m.reach)) * 1.2, 12, 99)); });

/* --- source lines 4406-4421 --- */
/* ---------- social listening topics ---------- */
const TRENDS = [
  { k: 'clean', ar: 'نظافة الشوارع', en: 'Street cleanliness', inc: 'CE-3041', sent: -62, base: 2400, peak: 8420, top: ['الرياض', 'جدة', 'الدمام'] },
  { k: 'vend', ar: 'الباعة الجائلون', en: 'Street vendors', inc: 'CE-3042', sent: -48, base: 1100, peak: 3180, top: ['جدة', 'مكة المكرمة', 'الرياض'] },
  { k: 'dump', ar: 'طمر النفايات خارج المرادم', en: 'Dumping outside landfills', inc: 'CE-3043', sent: -55, base: 210, peak: 640, top: ['الرياض', 'الدمام', 'جدة'] },
  { k: 'vp', ar: 'التشوه البصري واللوحات', en: 'Visual pollution and signage', inc: 'CE-3051', sent: -38, base: 780, peak: 1240, top: ['أبها', 'الطائف', 'حائل'] },
  { k: 'dig', ar: 'الحفريات وإغلاق الطرق', en: 'Excavations and road closures', inc: null, sent: -44, base: 900, peak: 1560, top: ['الرياض', 'جدة', 'المدينة المنورة'] },
];
function trendSeries(t) {
  const r = rng('tr' + t.k), a = [];
  for (let i = 0; i < 14; i++) {
    const ramp = i < 10 ? i / 10 * .35 : .35 + (i - 10) / 3 * .65;
    a.push(Math.round(t.base + (t.peak - t.base) * ramp * (.85 + r() * .3)));
  }
  a[13] = t.peak; return a;
}

/* --- source lines 4723-4813 --- */
const DNAMES = [['الملز', 'Al Malaz'], ['النهضة', 'An Nahdah'], ['الروضة', 'Ar Rawdah'], ['الشفا', 'Ash Shifa'],
  ['النخيل', 'An Nakheel'], ['الياسمين', 'Al Yasmin'], ['الربيع', 'Ar Rabi'], ['السلام', 'As Salam'],
  ['الفيصلية', 'Al Faisaliyah'], ['المروج', 'Al Muruj'], ['الخالدية', 'Al Khalidiyah'], ['العزيزية', 'Al Aziziyah'],
  ['الصفا', 'As Safa'], ['النزهة', 'An Nuzhah'], ['المحمدية', 'Al Muhammadiyah'], ['الأندلس', 'Al Andalus'],
  ['البساتين', 'Al Basateen'], ['الواحة', 'Al Wahah'], ['السويدي', 'As Suwaidi'], ['المنار', 'Al Manar'],
  ['الحمراء', 'Al Hamra'], ['المرجان', 'Al Murjan'], ['قرطبة', 'Qurtubah'], ['الشاطئ', 'Ash Shati']];
const SUB = {};
function subDistricts(cityId) {
  if (SUB[cityId]) return SUB[cityId];
  const c = U[cityId];
  if (!c) return [];
  if (c.ch.length) { SUB[cityId] = childrenOf(cityId); return SUB[cityId]; }   /* Riyadh: real polygons */
  const r = rng(cityId + 'sub'), n = clamp(Math.round(Math.sqrt(c.pop) / 170), 5, 10), out = [], used = new Set();
  for (let i = 0; i < n; i++) {
    let idx = (h32(cityId + 'd' + i)) % DNAMES.length;
    while (used.has(idx)) idx = (idx + 1) % DNAMES.length;
    used.add(idx);
    const ang = (i / n) * Math.PI * 2 + r() * .6, rad = .022 + r() * .034;
    const id = 'D2:' + cityId + '/' + idx;
    const u = { id, lvl: 3, syn: true, ar: DNAMES[idx][0], en: DNAMES[idx][1], p: cityId, ch: [],
      c: [c.c[0] + Math.sin(ang) * rad, c.c[1] + Math.cos(ang) * rad * 1.15],
      pop: Math.round(c.pop * (.05 + r() * .13)), comp: clamp((c.comp || 70) + (r() * 2 - 1) * 10, 34, 93) };
    U[id] = u; out.push(u);
  }
  SUB[cityId] = out; return out;
}
/* one navigation helper for every level of the chain */
function kidsOf(uid) {
  const u = U[uid]; if (!u) return [];
  if (u.lvl === 3) return [];                       /* districts hand over to hotspots */
  if (u.ch.length) return childrenOf(uid);
  if (u.lvl === 2) return subDistricts(uid);
  return [];
}
const levelOf = uid => (U[uid] ? U[uid].lvl : 0);

/* ---------- operational hotspots inside a district ---------- */
const HOTT = [
  { k: 'waste', dom: 'waste', kpi: 'perfc', ic: '🗑', ar: 'تكدس نفايات متكرر', en: 'Recurring waste accumulation',
    ev: [['حاويات غير مخدومة في موعدها', 'Bins not serviced on schedule'], ['بلاغات متكررة من السكان', 'Repeat resident reports']],
    act: ['إضافة دورة خدمة مسائية وتحقق مصوّر', 'Add an evening service cycle with photo verification'] },
  { k: 'dump', dom: 'waste', kpi: 'divcdw', ic: '♻', ar: 'طمر مخلفات في أرض فضاء', en: 'Dumping on vacant land',
    ev: [['مخلفات بناء وهدم دون تصريح نقل', 'Construction debris with no transport permit'], ['حركة شاحنات ليلية مرصودة', 'Night truck movements detected']],
    act: ['تسييج الأرض ومراقبة بالكاميرات المتنقلة', 'Fence the plot and monitor with mobile cameras'] },
  { k: 'vend', dom: 'reg', kpi: 'enf', ic: '🚫', ar: 'تجمع باعة جائلين', en: 'Street-vendor cluster',
    ev: [['إشغال أرصفة ومسارات مشاة', 'Sidewalk and footpath occupation'], ['وقوف مزدوج في أوقات الذروة', 'Double parking at peak hours']],
    act: ['ضبط ميداني مشترك مع المرور وتخصيص موقع بديل', 'Joint field control with Traffic and a designated alternative site'] },
  { k: 'bld', dom: 'reg', kpi: 'uio', ic: '🏚', ar: 'مبانٍ متهالكة ومهجورة', en: 'Dilapidated and abandoned buildings',
    ev: [['واجهات متهالكة على مسار المشاة', 'Deteriorated façades on the pedestrian route'], ['إنذارات سابقة دون معالجة', 'Prior notices with no remediation']],
    act: ['تحويل الإنذارات إلى أوامر عمل ملزمة', 'Convert notices into binding work orders'] },
  { k: 'dig', dom: 'reg', kpi: 'comp', ic: '⛏', ar: 'حفريات دون تصريح سارٍ', en: 'Excavation without a valid permit',
    ev: [['تصاريح منتهية والمواقع مفتوحة', 'Expired permits with sites still open'], ['إعادة وضع غير مكتملة', 'Incomplete reinstatement']],
    act: ['إيقاف الأعمال وإلزام المشغل بإعادة الوضع', 'Suspend works and require operator reinstatement'] },
  { k: 'walk', dom: 'infra', kpi: 'pave', ic: '🚶', ar: 'أرصفة مكسورة وإنارة معطلة', en: 'Broken sidewalks and failed lighting',
    ev: [['أعمدة إنارة خارج الخدمة', 'Lighting poles out of service'], ['أرصفة غير آمنة للمشاة', 'Sidewalks unsafe for pedestrians']],
    act: ['أمر صيانة عاجل لمسار المشاة كاملًا', 'Urgent maintenance order for the whole pedestrian route'] },
  { k: 'sign', dom: 'vis', kpi: 'vpi', ic: '👁', ar: 'لوحات ومظلات غير نظامية', en: 'Non-compliant signage and canopies',
    ev: [['لوحات تجارية دون رخصة', 'Commercial signs without a permit'], ['مظلات مخالفة على الواجهات', 'Non-compliant canopies on façades']],
    act: ['مهلة تصحيح ٢١ يومًا ثم الإزالة', '21-day correction window then removal'] },
  { k: 'food', dom: 'reg', kpi: 'comp', ic: '🍽', ar: 'منشآت غذائية متكررة المخالفة', en: 'Repeat-offending food establishments',
    ev: [['مخالفات اشتراطات صحية متكررة', 'Repeat health-requirement breaches'], ['سلسلة تبريد غير مستوفاة', 'Chill chain not maintained']],
    act: ['برنامج امتثال ملزم وإعادة تفتيش كل ٧ أيام', 'Mandatory compliance programme with re-inspection every 7 days'] },
  { k: 'flood', dom: 'infra', kpi: 'drain', ic: '💧', ar: 'نقطة تجمع مياه أمطار', en: 'Storm-water ponding point',
    ev: [['انسداد مصافي التصريف', 'Blocked drainage gullies'], ['تجمع مياه على مسار مروري', 'Ponding on a traffic lane']],
    act: ['تنظيف الشبكة قبل موجة الأمطار القادمة', 'Clear the network before the next rain event'] },
];
const STREETS = [['شارع الأمير سلطان', 'Prince Sultan St'], ['طريق الملك عبدالله', 'King Abdullah Rd'],
  ['شارع التحلية', 'Tahlia St'], ['شارع الستين', 'Sixty St'], ['طريق الملك فهد', 'King Fahd Rd'],
  ['شارع العروبة', 'Al Urubah St'], ['شارع الحزم', 'Al Hazm St'], ['طريق الأمير نايف', 'Prince Naif Rd']];
const HOT = {};
function hotspots(distId) {
  if (HOT[distId]) return HOT[distId];
  const d = U[distId]; if (!d || d.lvl !== 3) return [];
  const r = rng(distId + 'hot'), n = clamp(Math.round(3 + r() * 5), 3, 8), out = [];
  const cmp = d.comp === undefined ? 70 : d.comp;
  for (let i = 0; i < n; i++) {
    const t = HOTT[(h32(distId + 'h' + i)) % HOTT.length];
    const st = STREETS[(h32(distId + 's' + i)) % STREETS.length];
    const sevBase = clamp(4 - Math.round((cmp - 45) / 12) + Math.round(r() * 1.4), 1, 4);
    const ang = r() * Math.PI * 2, rad = .004 + r() * .012;
    out.push({ id: distId + '#' + i, t, dist: distId, sev: sevBase,
      ll: [d.c[0] + Math.sin(ang) * rad, d.c[1] + Math.cos(ang) * rad * 1.2],
      m: 120 + Math.round(r() * 380), n: 4 + Math.round(r() * 46), open: 1 + Math.round(r() * 12),
      rep: Math.round(r() * 8), last: Math.round(r() * 9), st: { ar: st[0], en: st[1] },
      ar: t.ar, en: t.en });
  }
  HOT[distId] = out.sort((a, b) => b.sev - a.sev || b.n - a.n);
  return HOT[distId];
}
const hotById = id => { const d = id.split('#')[0]; return hotspots(d).find(h => h.id === id); };
const hotCol = h => BANDC[clamp(4 - (4 - h.sev), 1, 4)];

/* --- source lines 4820-4857 --- */
Object.assign(I18N.ar, {
  mode_home: 'الرئيسية', mode_kpi2: 'مؤشرات الالتزام',
  h_gf: 'المرشحات العامة', h_period: 'الفترة', h_amana: 'الأمانة', h_city: 'المدينة', h_all: 'الكل', h_reset: 'إعادة تعيين',
  h_ins: 'الرؤى والإجراءات', h_ev: 'تقويم أحداث المدينة والأحداث الحرجة',
  h_f_ins: 'رؤى', h_f_act: 'إجراءات', h_f_dom: 'النطاق',
  h_f_ev: 'أحداث مجدولة', h_f_inc: 'أحداث حرجة',
  h_doms: 'النطاقات التشغيلية العشرة', h_dom_hint: 'اللون يوضح مكان الحاجة للتدخل · اضغط النطاق لعرض مؤشراته',
  h_kpis: 'مؤشرات النطاق', h_back: '← كل النطاقات', h_kpi_hint: 'اضغط المؤشر لتحديث الخريطة وتحليل الأسباب',
  h_where: 'أين تحتاج المدينة للتدخل؟', h_why: 'ما الأبعاد المسببة للفجوة؟',
  h_map: 'خريطة الحاجة للتدخل', h_att: 'مؤشر الحاجة للتدخل', h_score: 'صحة النطاق',
  h_off: 'دون المستهدف', h_of: 'من', h_kpi_n: 'مؤشرًا',
  att_0: 'لا حاجة للتدخل', att_1: 'حاجة محدودة', att_2: 'حاجة متوسطة', att_3: 'حاجة مرتفعة', att_4: 'حاجة حرجة',
  h_open: 'فتح الشاشة التفصيلية ↗', h_act: 'الإجراء', h_own: 'الجهة', h_imp: 'الأثر',
  h_ev_in: 'خلال', h_ev_day: 'يومًا', h_ev_rdy: 'الجاهزية', h_inc_risk: 'الخطورة',
  h_sel: 'المحدد', h_none: 'لا عناصر مطابقة للمرشحات',
  d_fin: 'الأداء المالي', d_infra: 'البنية التحتية والأشغال العامة', d_reg: 'التراخيص والامتثال',
  d_priv: 'الخصخصة وتحويل الخدمات', d_vis: 'المشهد البصري والنظافة', d_svc: 'الخدمة وتجربة المستفيد',
  d_waste: 'إدارة النفايات', d_res: 'المرونة وإدارة الأزمات', d_urb: 'التخطيط العمراني واستخدامات الأراضي', d_hou: 'الإسكان',
});
Object.assign(I18N.en, {
  mode_home: 'Home', mode_kpi2: 'Compliance KPIs',
  h_gf: 'Global filters', h_period: 'Period', h_amana: 'Amana', h_city: 'City', h_all: 'All', h_reset: 'Reset',
  h_ins: 'Insights & Actions', h_ev: 'City events calendar & critical incidents',
  h_f_ins: 'Insights', h_f_act: 'Actions', h_f_dom: 'Domain',
  h_f_ev: 'Scheduled events', h_f_inc: 'Critical incidents',
  h_doms: 'Ten operating domains', h_dom_hint: 'Colour shows where intervention is needed · click a domain for its KPIs',
  h_kpis: 'Domain KPIs', h_back: '← All domains', h_kpi_hint: 'Click a KPI to refocus the map and the cause analysis',
  h_where: 'Where does the city need attention?', h_why: 'Which dimensions drive the gap?',
  h_map: 'Attention map', h_att: 'Attention index', h_score: 'Domain health',
  h_off: 'below target', h_of: 'of', h_kpi_n: 'KPIs',
  att_0: 'No attention', att_1: 'Low attention', att_2: 'Moderate', att_3: 'High attention', att_4: 'Critical attention',
  h_open: 'Open detailed screen ↗', h_act: 'Action', h_own: 'Owner', h_imp: 'Impact',
  h_ev_in: 'in', h_ev_day: 'days', h_ev_rdy: 'Readiness', h_inc_risk: 'Risk',
  h_sel: 'Selected', h_none: 'Nothing matches the current filters',
  d_fin: 'Financial Performance', d_infra: 'Infrastructure & Public Works', d_reg: 'Regulatory Compliance & Enforcement',
  d_priv: 'Privatization & Service Transformation', d_vis: 'Visual Environment & Cleanliness', d_svc: 'Service & Customer Experience',
  d_waste: 'Waste Management', d_res: 'Resilience & Crisis Management', d_urb: 'Urban Planning & Land Use', d_hou: 'Housing',
});

/* --- source lines 4859-5117 --- */
/* ------------------------------------------------------------
   KPI registry — mapped from "Domains & KPIs.xlsx" (32 KPIs).
   DK: id, ar, en, unit, polarity, target, base, coef, dec, scale
   units: % · sar (million SAR) · cnt · vkm (violations/km²)
          · pkm (people/km²) · bd (business days)
   scale 'pop' = value and target scale with population
   REF(id) = reuses a KPI already modelled in depth on the
   Compliance screen, so both screens always agree.
   Targets are prototype assumptions — the file carries none.
   ------------------------------------------------------------ */
function DK(id, ar, en, u, dir, tgt, base, coef, dec, scale) {
  return { id, ar, en, u, dir, tgt, base, coef, dec: dec === undefined ? 1 : dec, scale: scale || null };
}
const REF = id => ({ id, ar: K[id].ar, en: K[id].en, u: K[id].u, dir: K[id].dir, tgt: K[id].tgt, dec: K[id].dec, reg: true });

const DOMAINS = [
  { id: 'fin', ic: '💰', kpis: [
    DK('rev', 'الإيرادات المفوترة', 'Billed Revenue', 'sar', 1, 100, 98, 3.4, 0, 'pop'),
    DK('opexcov', 'تغطية النفقات التشغيلية', 'Operational Expenditure Coverage', '%', 1, 92, 88, 3.4),
    DK('coll', 'معدل التحصيل', 'Collection Rate', '%', 1, 90, 84, 4.2),
  ], dims: [['gov', 'الرسوم الحكومية', 'Government fees'], ['inv', 'الاستثمار البلدي', 'Municipal investment'],
            ['fines', 'الغرامات', 'Fines'], ['serv', 'مقابل الخدمات', 'Service charges']] },

  { id: 'infra', ic: '🛣', kpis: [
    DK('delay', 'مؤشر مشاريع البنية التحتية المتعثرة', 'Delayed Infrastructure Projects Index', 'cnt', -1, 1.35, 1.45, -.24, 0, 'pop'),
    DK('pave', 'مؤشر حالة رصف الطرق', 'Road Pavement Condition Index', '%', 1, 85, 79, 4.2),
    DK('drain', 'تغطية شبكة تصريف مياه الأمطار', 'Stormwater Drainage Network Coverage', '%', 1, 90, 76, 5.6),
    DK('flood', 'التغطية بمشاريع درء أخطار السيول', 'Flood Risk Mitigation Projects Coverage', '%', 1, 80, 67, 5.2),
  ], dims: [['roads', 'الطرق والأرصفة', 'Roads and sidewalks'], ['light', 'الإنارة', 'Lighting'],
            ['drain', 'تصريف الأمطار', 'Drainage'], ['pub', 'المرافق العامة', 'Public facilities']] },

  { id: 'reg', ic: '⚖', kpis: [
    REF('comp'), REF('cov'),
    DK('covvp', 'معدل التغطية الرقابية للتشوه البصري', 'Coverage of Visual Pollution Inspection', '%', 1, 75, 66, 5.2),
    REF('enf'), REF('vpenf'), REF('uin'), REF('uio'),
  ], dims: null },

  { id: 'priv', ic: '🔄', kpis: [
    DK('privsh', 'نسبة الخدمات البلدية المخصخصة', 'Municipal Services Privatized', '%', 1, 60, 52, 3.8),
    DK('privfin', 'الأثر المالي للتخصيص', 'Financial Impact of Privatization', 'sar', 1, 20, 19.5, 2.1, 0, 'pop'),
  ], dims: [['clean', 'عقود النظافة', 'Cleaning contracts'], ['park', 'المواقف', 'Parking'],
            ['mkt', 'الأسواق والمسالخ', 'Markets and abattoirs'], ['maint', 'الصيانة', 'Maintenance']] },

  { id: 'vis', ic: '👁', kpis: [
    DK('vpi', 'مؤشر التشوه البصري', 'Visual Pollution Index', 'vkm', -1, 14, 17.6, -2.7),
    DK('vpiw', 'التشوه البصري — مخالفات النفايات', 'Visual Pollution Index — Waste Violations', 'vkm', -1, 6, 7.6, -1.25),
  ], dims: [['bld', 'المباني والواجهات', 'Buildings and façades'], ['str', 'الطرق والشوارع', 'Roads and streets'],
            ['sgn', 'اللوحات والإنارة', 'Signage and lighting'], ['open', 'الفراغات والحدائق', 'Open spaces and parks']] },

  { id: 'svc', ic: '😊', kpis: [
    REF('ttl'),
    DK('phys', 'نسبة الطلبات التي تستلزم زيارات حضورية', 'Requests Requiring Physical Visits', '%', -1, 14, 14.6, -1.8),
    REF('sat'),
    DK('satsv', 'رضا السكان عن الخدمات البلدية — استطلاع الرأي', 'Resident Satisfaction — Survey', '%', 1, 75, 70, 3.6),
  ], dims: [['lic', 'التراخيص', 'Licensing'], ['rep', 'البلاغات', 'Reports'],
            ['fld', 'الخدمات الميدانية', 'Field services'], ['pay', 'المدفوعات', 'Payments']] },

  { id: 'waste', ic: '♻', kpis: [
    DK('divmsw', 'استبعاد النفايات عن المرادم — النفايات البلدية الصلبة', 'Waste Diversion from Landfills — Solid Waste', '%', 1, 34, 26, 3.8),
    DK('divcdw', 'استبعاد النفايات عن المرادم — نفايات البناء والهدم', 'Waste Diversion from Landfills — Construction Waste', '%', 1, 28, 20, 3.4),
    DK('perfc', 'المناطق المغطاة بعقود الأداء لإدارة النفايات', 'Areas Covered by Waste Performance Contracts', '%', 1, 80, 73, 4.4),
  ], dims: [['hh', 'نفايات منزلية', 'Household waste'], ['com', 'نفايات تجارية', 'Commercial waste'],
            ['cnst', 'مخلفات البناء', 'Construction waste'], ['bulk', 'النفايات الضخمة', 'Bulky waste']] },

  { id: 'res', ic: '🛡', kpis: [
    DK('smood', 'النضج التنظيمي لإدارة الأزمات (صمود)', 'Organizational Maturity in Crisis Management (Resilience)', '%', 1, 82, 77, 3.8),
  ], dims: [['rain', 'الأمطار والسيول', 'Rain and flooding'], ['fire', 'الحرائق', 'Fire'],
            ['struct', 'السلامة الإنشائية', 'Structural safety'], ['event', 'الأحداث والحشود', 'Events and crowds']] },

  { id: 'urb', ic: '🏙', kpis: [
    DK('acc800', 'الوصول إلى الأماكن العامة في نطاق ٨٠٠ م', 'Accessibility to Public Spaces within 800 m', '%', 1, 62, 57, 4.8),
    DK('densb', 'الكثافة السكانية — النطاق العمراني', 'Population Density — Urban Boundary', 'pkm', 1, 1400, 1180, 64, 0),
    DK('densu', 'الكثافة السكانية — الكتلة العمرانية', 'Population Density — Urban Built-up Area', 'pkm', 1, 3000, 2620, 125, 0),
    DK('hexp', 'التوسع العمراني الأفقي ٢٠٢٠–٢٠٢٥', 'Horizontal Urban Expansion 2020–2025', '%', 1, 12, 9.4, .85),
  ], dims: [['res', 'سكني', 'Residential'], ['com', 'تجاري', 'Commercial'],
            ['ind', 'صناعي', 'Industrial'], ['pub', 'خدمات عامة', 'Public services']] },

  { id: 'hou', ic: '🏠', kpis: [
    DK('own', 'نسبة الأسر السعودية التي تمتلك وحدة سكنية', 'Saudi Households Owning a Housing Unit', '%', 1, 68, 64, 3.4),
    DK('devu', 'الأسر الأشد حاجة المستفيدة من الإسكان التنموي', 'Vulnerable Families in Developmental Housing', 'cnt', 1, 400, 352, 27, 0, 'pop'),
  ], dims: [['sub', 'الدعم السكني', 'Housing support'], ['dev', 'التطوير العقاري', 'Developers'],
            ['self', 'البناء الذاتي', 'Self-build'], ['rent', 'الإيجار', 'Rental']] },
];
const DOM = {}; DOMAINS.forEach(d => { d.ar = I18N.ar['d_' + d.id]; d.en = I18N.en['d_' + d.id]; DOM[d.id] = d; });
function bindRegDomain() { /* the registry is bound at load time */ }

/* ---------- value engine ---------- */
const _cmp = {};
function cmpOf(uid) {
  if (_cmp[uid] !== undefined) return _cmp[uid];
  const u = U[uid]; let v;
  if (u.comp !== undefined) v = u.comp;
  else if (u.ch.length) { let s = 0, sw = 0; u.ch.forEach(c => { s += U[c].pop * cmpOf(c); sw += U[c].pop; }); v = s / sw; }
  else v = 70;
  _cmp[uid] = v; return v;
}
const popF = uid => clamp((U[uid] && U[uid].pop ? U[uid].pop : 1e6) / 1e6, .02, 40);
/* target for this unit — population-scaled KPIs carry a per-million target */
const dT = (uid, k) => k && k.scale === 'pop' ? k.tgt * popF(uid) : (k ? k.tgt : 0);
const _dv = {};
function dVal(uid, dom, kid, dimK) {
  const d = DOM[dom], k = d.kpis.find(x => x.id === kid);
  if (!k) return 0;
  if (k.reg) return at(uid, kid, dimK || null);
  const key = uid + '|' + dom + '|' + kid + '|' + (dimK || '');
  if (_dv[key] !== undefined) return _dv[key];
  const c = cmpOf(uid), amp = k.u === '%' ? 2.6 : Math.max(.4, Math.abs(k.base) * .05);
  const off = dimK ? jit(uid + dom + kid + dimK, amp * 1.6) : 0;
  let v = k.base + k.coef * (c - 70) / 10 + jit(uid + dom + kid, amp) + off;
  if (k.scale === 'pop') v *= popF(uid);
  const lo = k.u === '%' ? 3 : 0, hi = k.u === '%' ? 99.5 : 1e7;
  v = clamp(v, lo, hi);
  _dv[key] = v; return v;
}
function dRatio(k, v, t) { const tg = t === undefined ? k.tgt : t;
  return k.dir === 1 ? v / Math.max(tg, 1e-6) : tg / Math.max(v, 1e-6); }
function dBand(k, v, t) { const r = dRatio(k, v, t); return r >= 1 ? 0 : r >= .95 ? 1 : r >= .88 ? 2 : r >= .78 ? 3 : 4; }
const dCol = (k, v, t) => BANDC[dBand(k, v, t)];
const dGap = (k, v, t) => { const tg = t === undefined ? k.tgt : t; return (k.dir === 1 ? v - tg : tg - v); };
function dFmt(k, v) {
  if (k.reg) return fmtV(k.id, v);
  switch (k.u) {
    case '%': return NF(v, k.dec) + '%';
    case 'bd': case 'd': return NF(v, k.dec) + (LANG === 'ar' ? ' ي' : 'd');
    case 'sar': return v >= 1000 ? NF(v / 1000, 1) + (LANG === 'ar' ? ' مليار' : 'B') : NF(v, 0) + (LANG === 'ar' ? ' مليون' : 'M');
    case 'vkm': return NF(v, 1) + (LANG === 'ar' ? '/كم²' : '/km²');
    case 'pkm': return NF(v, 0) + (LANG === 'ar' ? '/كم²' : '/km²');
    default: return NF(v, k.dec);
  }
}
/* domain health 0–100 and the mirror attention index */
function domScore(uid, dom) {
  const ks = DOM[dom].kpis; if (!ks.length) return 100;
  let s = 0; ks.forEach(k => { s += clamp(dRatio(k, dVal(uid, dom, k.id), dT(uid, k)) * 100, 0, 104); });
  return clamp(s / ks.length, 0, 100);
}
const domOff = (uid, dom) => DOM[dom].kpis.filter(k => dRatio(k, dVal(uid, dom, k.id), dT(uid, k)) < 1).length;
function attention(uid, dom) {
  if (dom) return 100 - domScore(uid, dom);
  let s = 0; DOMAINS.forEach(d => s += domScore(uid, d.id)); return 100 - s / DOMAINS.length;
}
const attBand = a => a <= 7 ? 0 : a <= 10.5 ? 1 : a <= 14 ? 2 : a <= 18 ? 3 : 4;
/* dimension contributions for the "why" block */
function domDims(uid, dom, kid) {
  const d = DOM[dom], k = d.kpis.find(x => x.id === kid);
  if (!k) return [];
  /* the visual-environment domain carries the coded NSPCL taxonomy */
  if (dom === 'vis' && typeof visDims === 'function') return visDims(uid, kid);
  if (k.reg && DIMS[K[kid].prim]) return dimContrib(uid, kid).map(x => ({ ar: x.it.ar, en: x.it.en, v: x.v, c: x.c, share: x.share, fmt: v => fmtV(kid, v) }));
  const items = d.dims || DIMS.org.items.map(i => [i.k, i.ar, i.en]);
  const tw = items.length || 1, tg = dT(uid, k);
  return items.map(it => { const v = dVal(uid, dom, kid, it[0]), g = dGap(k, v, tg);
    return { ar: it[1], en: it[2], v, c: g / tw, fmt: vv => dFmt(k, vv) }; }).sort((a, b) => a.c - b.c);
}
/* location contributions */
function locContrib(uid, dom, kid) {
  const ch = (typeof kidsOf === 'function' ? kidsOf(uid) : (U[uid].ch || []).map(id => U[id]));
  if (!ch.length) return [];
  const sw = ch.reduce((s, c) => s + c.pop, 0) || 1;
  const k = kid ? DOM[dom].kpis.find(x => x.id === kid) : null;
  return ch.map(c => {
    const w = c.pop / sw;
    if (k) { const t = dT(c.id, k), v = dVal(c.id, dom, k.id), g = dGap(k, v, t);
      return { u: c, v, w, c: w * g, fmt: vv => dFmt(k, vv), band: dBand(k, v, t) }; }
    const a = attention(c.id, dom);
    return { u: c, v: a, w, c: -w * a, fmt: vv => NF(vv, 0), band: attBand(a) };
  }).sort((a, b) => a.c - b.c);
}
/* ---------- insights & actions ---------- */
const ACTLIB = {
  fin: [['حملة تحصيل موجهة على أعلى ٥٠٠ ملف متأخر', 'Targeted collection drive on the top 500 overdue accounts'],
        ['ربط تجديد الرخصة بسداد المستحقات', 'Link licence renewal to settlement of dues']],
  infra: [['إعادة توزيع فرق الصيانة حسب كثافة البلاغات', 'Redistribute maintenance crews by report density'],
          ['برنامج صيانة وقائية للأصول الأكثر تعطلًا', 'Preventive maintenance programme for the most failure-prone assets']],
  reg: [['إيقاف تلقائي لأعمال الحفر عند انتهاء التصريح', 'Auto-suspend excavation works on permit expiry'],
        ['زيارة تحقق إلزامية خلال ٣٠ يومًا من الإصدار', 'Mandatory verification visit within 30 days of issuance']],
  priv: [['تطبيق الخصم التعاقدي الآلي على المشغلين المتأخرين', 'Apply automated contractual deductions to lagging operators'],
         ['نقل خدمتين إضافيتين إلى نموذج التشغيل الخاص', 'Move two more services to the private-operation model']],
  vis: [['حملة معالجة مركزة على المواقع متكررة التشوه', 'Focused clearance campaign on repeat visual-pollution sites'],
        ['حصر آلي للوحات عبر صور الشوارع وربطه بالرخص', 'Automated sign inventory from street imagery linked to permits']],
  svc: [['توجيه البلاغات آليًا إلى أقرب فريق متاح', 'Auto-route reports to the nearest available team'],
        ['تحقق مصوّر إلزامي قبل إغلاق البلاغ', 'Mandatory photo verification before closing a report']],
  waste: [['إضافة دورة خدمة مسائية في الأحياء الأعلى كثافة', 'Add an evening service cycle in the densest districts'],
          ['تسييج ومراقبة مواقع الطمر غير النظامي', 'Fence and monitor the illegal dumping sites']],
  res: [['تحديث خطط الطوارئ واختبارها ميدانيًا قبل الموسم', 'Update and field-test emergency plans before the season'],
        ['تخصيص فرق استجابة سريعة للنطاقات عالية الخطورة', 'Dedicate rapid-response teams to high-risk scopes']],
  urb: [['رقمنة مسار اعتماد المخططات بالكامل', 'Fully digitise the plan-approval route'],
        ['إنفاذ اشتراطات استخدامات الأراضي على المخالفات القائمة', 'Enforce land-use conditions on existing breaches']],
  hou: [['تسريع شهادات الإتمام عبر التحقق الميداني المصوّر', 'Accelerate completion certificates with photo-based verification'],
        ['مراجعة جودة الوحدات المسلَّمة مع المطورين', 'Review delivered-unit quality with developers']],
};
function genInsights(uid, dom) {
  const out = [];
  if (dom) {                                     /* focused: one insight per off-target KPI */
    const d = DOM[dom];
    d.kpis.map(k => ({ k, v: dVal(uid, dom, k.id) })).sort((a, b) => dRatio(a.k, a.v, dT(uid, a.k)) - dRatio(b.k, b.v, dT(uid, b.k))).slice(0, 5)
      .forEach((x, n) => {
        const loc = locContrib(uid, dom, x.k.id)[0], gap = Math.abs(dGap(x.k, x.v, dT(uid, x.k)));
        const act = ACTLIB[dom][(h32(uid + dom + x.k.id) + n) % ACTLIB[dom].length];
        out.push({ dom, kpi: x.k.id, sev: dBand(x.k, x.v, dT(uid, x.k)), gap,
          ar: `${x.k.ar} عند ${dFmt(x.k, x.v)} مقابل مستهدف ${dFmt(x.k, dT(uid, x.k))}${loc ? ` — أكبر فجوة في ${loc.u.ar}` : ''}`,
          en: `${x.k.en} at ${dFmt(x.k, x.v)} against a ${dFmt(x.k, dT(uid, x.k))} target${loc ? ` — largest gap in ${loc.u.en}` : ''}`,
          act: { ar: act[0], en: act[1] }, imp: NF(gap * .45, 1) + (x.k.u === '%' ? ' ' + (LANG === 'ar' ? 'نقطة' : 'pts') : ''),
          loc: loc ? loc.u : U[uid] });
      });
    return out.sort((a, b) => b.sev - a.sev || b.gap - a.gap);
  }
  DOMAINS.forEach(d => {
    if (!d.kpis.length) return;
    const worst = d.kpis.map(k => ({ k, v: dVal(uid, d.id, k.id), r: dRatio(k, dVal(uid, d.id, k.id), dT(uid, k)) })).sort((a, b) => a.r - b.r)[0];
    const loc = locContrib(uid, d.id, worst.k.id)[0];
    const gap = Math.abs(dGap(worst.k, worst.v, dT(uid, worst.k)));
    const act = ACTLIB[d.id][h32(uid + d.id) % ACTLIB[d.id].length];
    out.push({ dom: d.id, kpi: worst.k.id, sev: dBand(worst.k, worst.v), gap,
      ar: `${worst.k.ar} عند ${dFmt(worst.k, worst.v)} مقابل مستهدف ${dFmt(worst.k, dT(uid, worst.k))}${loc ? ` — أكبر فجوة في ${loc.u.ar}` : ''}`,
      en: `${worst.k.en} at ${dFmt(worst.k, worst.v)} against a ${dFmt(worst.k, dT(uid, worst.k))} target${loc ? ` — largest gap in ${loc.u.en}` : ''}`,
      act: { ar: act[0], en: act[1] },
      imp: NF(gap * .45, 1) + (worst.k.u === '%' ? ' ' + (LANG === 'ar' ? 'نقطة' : 'pts') : ''),
      loc: loc ? loc.u : U[uid] });
  });
  return out.sort((a, b) => b.sev - a.sev || b.gap - a.gap);
}
/* ---------- domain tagging for events and incidents ---------- */
const INC_DOM = { 'CE-3041': 'vis', 'CE-3042': 'reg', 'CE-3043': 'waste', 'CE-3044': 'res', 'CE-3045': 'res',
  'CE-3046': 'infra', 'CE-3047': 'vis', 'CE-3048': 'reg', 'CE-3049': 'urb', 'CE-3050': 'infra',
  'CE-3051': 'vis', 'CE-3052': 'infra', 'CE-3053': 'reg' };
const EV_DOM = { asiacup: 'res', season: 'svc', f1: 'res', natday: 'vis', marathon: 'infra', founding: 'vis', hajj: 'res', jedseason: 'waste' };

/* ==== p14_who.js ==== */
/* ============================================================
   WHO — the parties behind a KPI's gap.
   Answers "which contractor, sector or internal unit is
   producing this?" — including cross-domain causes, e.g. a
   waste collection operator driving the visual-pollution index.
   Accountability at contract / sector level. No personal data.
   ============================================================ */
Object.assign(I18N.ar, {
  w_ttl: 'من الأطراف المسببة؟', w_hint_g: 'نسبة المساهمة في الفجوة',
  w_hint_v: 'نسبة المساهمة في الحجم المرصود', w_none: 'لا توجد أطراف مرتبطة بهذا المؤشر',
  w_share: 'المساهمة', w_vol: 'الحجم', w_mech: 'كيف يؤثر هذا الطرف',
  w_req: 'ما يجب إلزامه به', w_metric: 'المؤشر التعاقدي', w_scope: 'النطاق',
  w_cross: 'أثر من نطاق آخر', w_kind_c: 'عقد تشغيلي', w_kind_s: 'قطاع منظَّم',
  w_kind_i: 'جهة داخلية', w_kind_n: 'نشاط غير منظَّم',
  w_ttl2: 'الطرف المسبب', w_breach: 'تجاوز مستوى الخدمة', w_cases: 'حالة مرتبطة',
  w_priv: 'المساءلة على مستوى العقد والقطاع — دون بيانات شخصية',
  w_of: 'من', w_kpi: 'المؤشر المتأثر', w_top: 'الأثر الأكبر',
});
Object.assign(I18N.en, {
  w_ttl: 'Who is causing it?', w_hint_g: 'share of the gap',
  w_hint_v: 'share of recorded volume', w_none: 'No parties mapped to this KPI',
  w_share: 'Share', w_vol: 'Volume', w_mech: 'How this party drives it',
  w_req: 'What to require', w_metric: 'Contract metric', w_scope: 'Scope',
  w_cross: 'Cross-domain cause', w_kind_c: 'Operating contract', w_kind_s: 'Regulated sector',
  w_kind_i: 'Internal unit', w_kind_n: 'Informal activity',
  w_ttl2: 'Contributing party', w_breach: 'Past SLA', w_cases: 'Linked cases',
  w_priv: 'Accountability at contract and sector level — no personal data',
  w_of: 'of', w_kpi: 'Affected KPI', w_top: 'Largest effect',
});


/* --- source lines 5119-5519 --- */
const PTY = {
  wst:  { ic: '🗑', k: 'c', dom: 'waste', ar: 'مشغل جمع النفايات البلدية', en: 'Municipal waste collection operator', pre: 'W' },
  cd:   { ic: '🚛', k: 'c', dom: 'waste', ar: 'ناقل مخلفات البناء والهدم', en: 'C&D waste hauler', pre: 'W' },
  cln:  { ic: '🧹', k: 'c', dom: 'vis',   ar: 'مشغل نظافة الطرق والساحات', en: 'Street cleansing operator', pre: 'C' },
  mnt:  { ic: '🛠', k: 'c', dom: 'infra', ar: 'مقاول صيانة الأصول', en: 'Asset maintenance contractor', pre: 'M' },
  lgt:  { ic: '💡', k: 'c', dom: 'infra', ar: 'مشغل الإنارة', en: 'Lighting contractor', pre: 'M' },
  vpr:  { ic: '👁', k: 'c', dom: 'vis',   ar: 'مشغل إزالة التشوه البصري', en: 'VP removal operator', pre: 'C' },
  adv:  { ic: '📢', k: 's', dom: 'vis',   ar: 'شركات اللوحات والإعلان', en: 'Signage & advertising firms', pre: 'S' },
  dev:  { ic: '🏗', k: 's', dom: 'urb',   ar: 'المطوّرون ومقاولو البناء', en: 'Developers & building contractors', pre: 'S' },
  util: { ic: '⚡', k: 's', dom: 'infra', ar: 'شركات الخدمات — كهرباء ومياه واتصالات', en: 'Utilities — power, water, telecom', pre: 'S' },
  food: { ic: '🍽', k: 's', dom: 'reg',   ar: 'المنشآت الغذائية', en: 'Food establishments', pre: 'S' },
  ret:  { ic: '🏬', k: 's', dom: 'reg',   ar: 'المنشآت التجارية', en: 'Retail establishments', pre: 'S' },
  gac:  { ic: '🏨', k: 's', dom: 'reg',   ar: 'منشآت إسكان العمال', en: 'Group-accommodation operators', pre: 'S' },
  vend: { ic: '🚫', k: 'n', dom: 'reg',   ar: 'الباعة الجائلون', en: 'Street vendors', pre: 'N' },
  insp: { ic: '🔎', k: 'i', dom: 'reg',   ar: 'فرق التفتيش البلدي', en: 'Municipal inspection teams', pre: 'I' },
  enf:  { ic: '⚖', k: 'i', dom: 'reg',   ar: 'وحدة الإنفاذ والضبط', en: 'Enforcement unit', pre: 'I' },
  lic:  { ic: '📋', k: 'i', dom: 'svc',   ar: 'إدارة التراخيص', en: 'Licensing department', pre: 'I' },
  prj:  { ic: '📐', k: 'i', dom: 'infra', ar: 'إدارة المشاريع', en: 'Projects department', pre: 'I' },
  fin:  { ic: '💰', k: 'i', dom: 'fin',   ar: 'إدارة الإيرادات والتحصيل', en: 'Revenue & collection department', pre: 'I' },
  plan: { ic: '🗺', k: 'i', dom: 'urb',   ar: 'إدارة التخطيط العمراني', en: 'Urban planning department', pre: 'I' },
};
const kindKey = k => k === 'c' ? 'w_kind_c' : k === 's' ? 'w_kind_s' : k === 'i' ? 'w_kind_i' : 'w_kind_n';

/* how a party drives a KPI, and what the city can require of it */
function P(p, w, mAr, mEn, rAr, rEn) { return { p, w, mAr, mEn, rAr, rEn }; }

/* explicit maps for the operationally meaningful KPIs */
const WHOMAP = {
  /* ---- visual pollution: the cross-domain case the mayor asks about ---- */
  vpi: [
    P('wst', .27, 'حاويات غير مخدومة في موعدها تتحول إلى تكدس يُرصد كتشوه بصري',
      'Bins not serviced on schedule become accumulation recorded as visual pollution',
      'دورة خدمة مسائية إضافية وتحقق مصوّر لكل نقطة تكدس متكررة',
      'An added evening service cycle with photo verification at every repeat point'),
    P('adv', .21, 'لوحات ومظلات تجارية غير نظامية على الواجهات ومسارات المشاة',
      'Non-compliant commercial signage and canopies on façades and pedestrian routes',
      'مهلة تصحيح ٢١ يومًا ثم الإزالة على حساب المنشأة',
      'A 21-day correction window, then removal at the establishment’s cost'),
    P('cd', .18, 'طمر مخلفات بناء وهدم في أراضٍ فضاء دون تصريح نقل',
      'Construction and demolition debris dumped on vacant land with no transport permit',
      'ربط إغلاق رخصة الهدم بإثبات وجهة المخلفات',
      'Tie demolition-permit closure to proof of the debris destination'),
    P('dev', .16, 'مواقع بناء غير مسوّرة ومخلفات على الأرصفة المجاورة',
      'Unfenced construction sites and debris on adjacent sidewalks',
      'اشتراط التسييج والتنظيف اليومي قبل صرف مستخلصات المشروع',
      'Require fencing and daily clearing before project payments are released'),
    P('cln', .10, 'دورات نظافة فائتة على المسارات الرئيسية والساحات العامة',
      'Missed cleansing cycles on main corridors and public squares',
      'تحويل العقد إلى الدفع مقابل النتيجة المرصودة لا مقابل الدورة',
      'Move the contract to payment against verified outcome, not per cycle'),
    P('vend', .08, 'إشغال الأرصفة ومخلفات متروكة بعد انصراف الباعة',
      'Sidewalk occupation and waste left behind after vendors disperse',
      'تخصيص موقع بديل مع ضبط ميداني مشترك في أوقات الذروة',
      'A designated alternative site plus joint field control at peak hours'),
  ],
  vpiw: [
    P('wst', .34, 'جمع فائت متكرر في النطاقات ذات الكثافة العالية',
      'Repeated missed collections in high-density zones',
      'إعادة توزيع الجداول حسب معدل التوليد لا حسب المساحة',
      'Rebalance schedules by generation rate rather than by area'),
    P('cd', .26, 'حمولات مخلفات بناء غير محتسبة مقابل الكمية المتوقعة من الرخص',
      'C&D loads unaccounted for against the tonnage expected from permits',
      'تتبع الحمولات إلكترونيًا من الموقع حتى مرفق المعالجة',
      'Track loads electronically from site to treatment facility'),
    P('cln', .18, 'تراكم على المسارات بين دورات النظافة',
      'Build-up along corridors between cleansing cycles',
      'زيادة تكرار الدورات في النقاط المتكررة المرصودة',
      'Increase cycle frequency at recorded repeat points'),
    P('ret', .12, 'مخلفات تجارية على الرصيف خارج أوقات الجمع',
      'Commercial waste on the sidewalk outside collection windows',
      'إلزام المنشآت بحاويات مخصصة وأوقات إخراج محددة',
      'Require dedicated bins and fixed put-out times'),
    P('food', .10, 'مخلفات عضوية ودهون من المنشآت الغذائية',
      'Organic waste and grease from food establishments',
      'عقد تصريف دهون معتمد كشرط لتجديد الرخصة الصحية',
      'An approved grease-disposal contract as a health-licence renewal condition'),
  ],
  /* ---- regulatory ---- */
  comp: [
    P('food', .27, 'مخالفات اشتراطات صحية متكررة وسلسلة تبريد غير مستوفاة',
      'Repeat health-requirement breaches and an unmaintained chill chain',
      'برنامج امتثال ملزم وإعادة تفتيش كل ٧ أيام',
      'A mandatory compliance programme with re-inspection every 7 days'),
    P('ret', .22, 'إشغال خارج الحدود ولوحات دون ترخيص',
      'Occupation beyond boundaries and unlicensed signage',
      'ربط تجديد الرخصة بإغلاق المخالفات القائمة',
      'Tie licence renewal to closing the open violations'),
    P('gac', .19, 'اشتراطات السكن الجماعي — كثافة وسلامة',
      'Group-accommodation requirements — density and safety',
      'خطة تصحيح مرحلية مع سقف إشغال ملزم',
      'A phased correction plan with a binding occupancy cap'),
    P('util', .17, 'حفريات دون تصريح سارٍ وإعادة وضع غير مكتملة',
      'Excavation without a valid permit and incomplete reinstatement',
      'ضمان مالي يُصرف بعد التحقق من إعادة الوضع',
      'A financial guarantee released only after reinstatement is verified'),
    P('insp', .15, 'تفتيش غير متوازن — تكرار على منشآت ملتزمة وإغفال المتكررة',
      'Unbalanced inspection — repeat visits to compliant sites, repeat offenders missed',
      'جدولة التفتيش على أساس المخاطر لا على أساس التوزيع المتساوي',
      'Schedule inspection by risk rather than by even distribution'),
  ],
  cov: [
    P('insp', .48, 'طاقة الفرق أقل من عدد الرخص المستحقة للتفتيش في الدورة',
      'Team capacity below the number of licences due for inspection in the cycle',
      'توزيع الحمل بين الأمانات في أوقات الذروة وتفتيش مُصنَّف بالمخاطر',
      'Balance load across Amanas at peak and inspect by risk class'),
    P('lic', .24, 'بيانات الرخص غير محدّثة فتغيب منشآت عن قائمة الاستحقاق',
      'Stale licence data leaves establishments off the due list',
      'تنقية سجل الرخص وربطه بالسجل التجاري آليًا',
      'Clean the licence register and auto-link it to the commercial register'),
    P('ret', .16, 'منشآت مغلقة أو منتقلة دون تحديث العنوان',
      'Establishments closed or relocated without updating the address',
      'إلزام التبليغ عن الانتقال أو الإغلاق قبل ٣٠ يومًا',
      'Require notification of relocation or closure 30 days in advance'),
    P('food', .12, 'رفض الزيارة أو إغلاق مؤقت متكرر في أوقات التفتيش',
      'Visit refusal or repeated temporary closure during inspection hours',
      'زيارات مسائية ومحاسبة على تعطيل الزيارة',
      'Evening visits, with accountability for obstructing a visit'),
  ],
  enf: [
    P('enf', .44, 'مخالفات مرصودة تُغلق دون إصدار إجراء',
      'Detected violations closed with no action issued',
      'إصدار آلي للإجراء عند تسجيل نتيجة غير ملتزمة',
      'Auto-issue the action when a non-compliant result is recorded'),
    P('insp', .23, 'محاضر ناقصة الأدلة لا تصمد أمام الاعتراض',
      'Reports with incomplete evidence do not survive objection',
      'قائمة أدلة إلزامية مصوّرة قبل إغلاق الزيارة',
      'A mandatory photo-evidence checklist before the visit can be closed'),
    P('food', .18, 'اعتراضات متكررة تعطّل تنفيذ الغرامات',
      'Repeated objections stall fine execution',
      'تحصيل مرحلي مع إيقاف النشاط عند التكرار الثالث',
      'Staged collection, with activity suspension on the third repeat'),
    P('vend', .15, 'نشاط غير منظَّم يصعب توثيق هويته التجارية',
      'Informal activity with no commercial identity to document',
      'ترخيص مبسّط لمواقع محددة يحوّل النشاط إلى قابل للإنفاذ',
      'A simplified permit for designated sites, making the activity enforceable'),
  ],
  vpenf: [
    P('vpr', .34, 'أوامر إزالة تُغلق دون تحقق ميداني فتعود العناصر',
      'Removal orders closed without field verification, so elements return',
      'إغلاق أمر العمل بصورة بعد المعالجة وتفتيش تحقق بعد ٣٠ يومًا',
      'Close the work order with an after photo and re-verify at 30 days'),
    P('adv', .26, 'إعادة تركيب اللوحات بعد الإزالة',
      'Signage reinstalled after removal',
      'غرامة تصاعدية على التكرار مع سحب موافقة الموقع',
      'An escalating fine on repeats, with withdrawal of the site approval'),
    P('cln', .21, 'عناصر مرصودة لا تُدرج في نطاق العقد',
      'Recorded elements that fall outside the contract scope',
      'توسيع نطاق العقد ليغطي التصنيفات المرصودة فعليًا',
      'Widen the contract scope to cover the categories actually recorded'),
    P('enf', .19, 'إنذارات لا تتحول إلى أوامر عمل ملزمة',
      'Notices that never become binding work orders',
      'تحويل الإنذار تلقائيًا إلى أمر عمل عند انتهاء المهلة',
      'Auto-convert the notice into a work order when the window expires'),
  ],
  uin: [
    P('dev', .52, 'تنفيذ مخالف لدليل الهوية العمرانية في الواجهات والمواد',
      'Construction departing from the urban-identity manual in façades and materials',
      'اعتماد الواجهة قبل الترخيص وربط شهادة الإتمام بالمطابقة',
      'Approve the façade before permitting and tie the completion certificate to conformity'),
    P('plan', .28, 'دليل غير محدَّث أو غير واضح للحالات الشائعة',
      'A manual that is out of date or unclear for common cases',
      'أمثلة معتمدة مسبقًا لكل نمط بناء متكرر',
      'Pre-approved examples for every recurring building type'),
    P('insp', .20, 'التفتيش يتم بعد اكتمال الهيكل فيصعب التصحيح',
      'Inspection happens after the structure is complete, making correction costly',
      'نقطة تفتيش إلزامية عند مرحلة الواجهة',
      'A mandatory inspection point at the façade stage'),
  ],
  uio: [
    P('dev', .34, 'مبانٍ قائمة مهجورة دون مالك متعاون',
      'Existing abandoned buildings with no cooperating owner',
      'أمر عمل على حساب المالك مع رهن التحصيل على العقار',
      'A work order at the owner’s cost, secured against the property'),
    P('vpr', .28, 'معالجات سطحية لا تصمد لموسم واحد',
      'Surface-level remediation that does not last a single season',
      'مواصفة معالجة ملزمة وضمان ١٢ شهرًا',
      'A binding remediation specification with a 12-month warranty'),
    P('enf', .22, 'إنذارات سابقة دون تصعيد',
      'Prior notices with no escalation',
      'مسار تصعيد زمني إلزامي لكل إنذار',
      'A mandatory time-based escalation path for every notice'),
    P('adv', .16, 'لوحات متهالكة على مبانٍ قائمة',
      'Deteriorated signage on existing buildings',
      'إزالة اللوحة عند انتهاء ترخيصها دون تجديد',
      'Remove the sign when its permit lapses without renewal'),
  ],
  /* ---- services ---- */
  ttl: [
    P('lic', .46, 'تكدس الطلبات في مرحلة الفحص الفني',
      'Backlog at the technical review stage',
      'توزيع حِمل الفحص آليًا في أوقات الذروة',
      'Auto-balance the review workload at peak'),
    P('insp', .28, 'انتظار الزيارة الميدانية داخل مسار الإصدار',
      'Waiting for the field visit inside the issuance path',
      'جدولة الزيارة تلقائيًا عند استكمال الطلب',
      'Auto-schedule the visit when the application is complete'),
    P('ret', .16, 'طلبات ناقصة المستندات تعاد أكثر من مرة',
      'Applications with missing documents returned more than once',
      'تحقق آلي من المستندات قبل القبول',
      'Automated document validation before intake'),
    P('util', .10, 'موافقات جهات خارجية داخل المسار',
      'Third-party approvals inside the path',
      'اتفاقية مستوى خدمة ملزمة مع الجهات المرتبطة',
      'A binding service-level agreement with the connected agencies'),
  ],
  sat: [
    P('lic', .32, 'طول مسار الخدمة وتعدد المراجعات', 'A long service path with repeated visits',
      'إنهاء الخدمة رقميًا دون زيارة حضورية', 'Complete the service digitally with no counter visit'),
    P('cln', .26, 'نظافة الشارع هي أول ما يقيسه الساكن', 'Street cleanliness is the first thing a resident judges',
      'ربط أداء العقد بمؤشر رضا النطاق', 'Tie contract performance to the zone satisfaction score'),
    P('wst', .24, 'جمع فائت يولّد شكاوى متكررة', 'Missed collections generate repeat complaints',
      'إشعار الساكن بموعد الجمع وتأكيد التنفيذ', 'Notify residents of the collection window and confirm execution'),
    P('mnt', .18, 'أرصفة وإنارة معطلة في محيط السكن', 'Broken sidewalks and failed lighting around the home',
      'أمر صيانة عاجل لمسار المشاة كاملًا', 'An urgent maintenance order for the whole pedestrian route'),
  ],
  satsv: [
    P('cln', .3, 'نظافة الأحياء والساحات', 'Neighbourhood and square cleanliness',
      'دفع مقابل النتيجة المرصودة', 'Payment against verified outcome'),
    P('wst', .27, 'انتظام الجمع المنزلي', 'Regularity of household collection',
      'جدول معلن وتأكيد تنفيذ لكل نطاق', 'A published schedule with execution confirmation per zone'),
    P('mnt', .23, 'حالة الأرصفة والحدائق', 'Sidewalk and park condition',
      'برنامج صيانة وقائية بدل الاستجابة للبلاغات', 'A preventive maintenance programme instead of reacting to reports'),
    P('lic', .2, 'سهولة إنهاء الخدمات البلدية', 'Ease of completing municipal services',
      'تبسيط الخطوات وإلغاء المستندات المتكررة', 'Simplify the steps and drop duplicate documents'),
  ],
  phys: [
    P('lic', .55, 'خطوات تستلزم التحقق الورقي حضوريًا', 'Steps that require paper verification in person',
      'تحقق إلكتروني من المستندات المصدرية', 'Electronic verification against source documents'),
    P('ret', .25, 'طلبات تُقدَّم ناقصة فتُستكمل حضوريًا', 'Applications submitted incomplete and finished at the counter',
      'إرشاد موجَّه ورفع مسبق للمستندات', 'Guided intake with documents uploaded up front'),
    P('insp', .2, 'زيارات ميدانية لا يمكن استبدالها بالتحقق المرئي', 'Field visits not replaceable by remote verification',
      'تحقق مرئي معتمد للحالات منخفضة المخاطر', 'Approved remote verification for low-risk cases'),
  ],
  /* ---- waste ---- */
  perfc: [
    P('wst', .42, 'نطاقات بلا عقد أداء سارٍ', 'Zones with no active performance contract',
      'إدراج النطاقات غير المغطاة في الحزمة التعاقدية القادمة',
      'Include the uncovered zones in the next contracting package'),
    P('cd', .3, 'تيار البناء والهدم خارج نطاق العقود القائمة', 'The C&D stream sits outside existing contracts',
      'عقد مستقل لتيار البناء والهدم بمؤشرات وجهة', 'A separate C&D contract with destination indicators'),
    P('fin', .28, 'قيمة العقد لا تغطي معدل التوليد الفعلي', 'Contract value below the actual generation rate',
      'إعادة تسعير على أساس الأطنان المرصودة', 'Re-price against recorded tonnage'),
  ],
  divmsw: [
    P('wst', .38, 'الفرز من المصدر غير مطبَّق فعليًا', 'Source separation not actually applied',
      'حاويات مزدوجة وحوافز للنطاقات الملتزمة', 'Dual bins plus incentives for compliant zones'),
    P('ret', .24, 'خلط المخلفات القابلة للاستعادة عند المنشآت', 'Recoverable waste mixed at the establishment',
      'فصل إلزامي كشرط في الرخصة التجارية', 'Mandatory separation as a retail-licence condition'),
    P('food', .2, 'مخلفات عضوية تذهب للمردم', 'Organic waste going to landfill',
      'مسار معالجة عضوية مخصص للمنشآت الغذائية', 'A dedicated organics route for food establishments'),
    P('cln', .18, 'الجمع من الحاويات العامة دون فرز', 'Public-bin collection with no separation',
      'حاويات فرز في الأماكن عالية الحركة', 'Sorting bins in high-footfall locations'),
  ],
  divcdw: [
    P('cd', .46, 'حمولات غير مسجَّلة الوجهة — الفارق يظهر كطمر عشوائي',
      'Loads with no recorded destination — the gap surfaces as illegal dumping',
      'تتبع إلكتروني من الموقع حتى المرفق قبل إغلاق الرخصة',
      'Electronic tracking from site to facility before the permit can close'),
    P('dev', .3, 'كميات هدم أعلى من المصرَّح بها', 'Demolition volumes higher than declared',
      'كمية متوقعة محتسبة من مساحة الهدم في الرخصة', 'An expected tonnage computed from the permitted demolition area'),
    P('wst', .24, 'خلط تيار البناء مع التيار البلدي', 'The construction stream mixed into the municipal stream',
      'فصل تعاقدي واضح بين التيارين', 'A clear contractual split between the two streams'),
  ],
  /* ---- infrastructure ---- */
  pave: [
    P('mnt', .4, 'أوامر صيانة تتجاوز مستوى الخدمة أو تُغلق دون تحقق',
      'Maintenance orders past SLA, or closed without verification',
      'الدفع بعد التحقق المصوّر لا بعد الإبلاغ عن الإنجاز',
      'Pay after photo verification, not after a completion report'),
    P('util', .32, 'حفريات الخدمات وإعادة وضع غير مطابقة',
      'Utility excavation with sub-standard reinstatement',
      'ضمان إعادة وضع ٢٤ شهرًا مع فحص عيّنات',
      'A 24-month reinstatement warranty with sample testing'),
    P('prj', .28, 'مشاريع رصف متعثرة تترك مقاطع دون معالجة',
      'Stalled paving projects leaving sections untreated',
      'حزم صيانة قصيرة بدلًا من انتظار المشروع الكبير',
      'Short maintenance packages instead of waiting for the large project'),
  ],
  drain: [
    P('prj', .44, 'مشاريع شبكة التصريف خارج الجدول الزمني', 'Drainage network projects behind schedule',
      'أولوية للنطاقات ذات تاريخ تجمع مياه متكرر', 'Prioritise zones with a history of repeat ponding'),
    P('mnt', .32, 'مصافي غير منظفة قبل موسم الأمطار', 'Gullies not cleared before the rain season',
      'تنظيف موسمي إلزامي مع إثبات مصوّر', 'Mandatory seasonal clearing with photo proof'),
    P('dev', .24, 'تطوير جديد يصرّف على شبكة غير مهيأة', 'New development discharging into an unprepared network',
      'اشتراط دراسة تصريف قبل الترخيص', 'Require a drainage study before permitting'),
  ],
  flood: [
    P('prj', .5, 'مشاريع درء الأخطار متأخرة عن المناطق المعرّضة', 'Mitigation projects lagging the exposed areas',
      'إعادة ترتيب الأولويات وفق خرائط الخطر', 'Re-sequence priorities against the hazard maps'),
    P('plan', .28, 'تخطيط يسمح بالبناء في مسارات السيول', 'Planning that permits building in flood paths',
      'حظر البناء في المسارات مع تعويض بالنقل', 'Prohibit building in the paths, with transfer-based compensation'),
    P('mnt', .22, 'صيانة المنشآت القائمة دون المستوى', 'Sub-standard maintenance of existing structures',
      'فحص سنوي قبل الموسم', 'An annual pre-season inspection'),
  ],
  delay: [
    P('prj', .46, 'إخفاق في التخطيط والتسليم للمواقع', 'Planning and site-handover failures',
      'بوابة مراجعة إلزامية قبل الترسية', 'A mandatory review gate before award'),
    P('util', .3, 'تعارض الخدمات يوقف الأعمال', 'Utility conflicts halting works',
      'مسح خدمات مسبق ملزم قبل الترسية', 'A binding pre-award utility survey'),
    P('fin', .24, 'تدفق مالي غير منتظم يعطّل التنفيذ', 'Irregular cash flow stalling execution',
      'ربط الاعتمادات بجدول التنفيذ', 'Tie budget releases to the delivery schedule'),
  ],
  /* ---- financial ---- */
  rev:  [P('fin', .4, 'رسوم غير مفوترة على أنشطة قائمة', 'Unbilled fees on active operations',
      'مطابقة دورية بين الرخص السارية والفواتير', 'A periodic reconciliation of active licences against invoices'),
    P('lic', .32, 'رخص سارية دون احتساب الرسوم المستحقة', 'Active licences with fees not assessed',
      'احتساب آلي للرسوم عند الإصدار والتجديد', 'Auto-assess fees at issuance and renewal'),
    P('enf', .28, 'غرامات مرصودة دون تحصيل', 'Fines recorded but not collected',
      'ربط التحصيل بتجديد الرخصة', 'Tie collection to licence renewal')],
  coll: [P('fin', .46, 'متابعة تحصيل غير منتظمة للمستحقات المتأخرة', 'Irregular follow-up on overdue receivables',
      'تصنيف المستحقات بالأعمار وتصعيد آلي', 'Age the receivables and escalate automatically'),
    P('ret', .3, 'منشآت متأخرة عن السداد وتواصل النشاط', 'Establishments in arrears that continue operating',
      'إيقاف الخدمات البلدية عند التأخر ٩٠ يومًا', 'Suspend municipal services at 90 days overdue'),
    P('enf', .24, 'غرامات محكومة دون إنفاذ للتحصيل', 'Adjudicated fines with no collection enforcement',
      'مسار إنفاذ مالي موحّد', 'A single financial enforcement path')],
  opexcov: [P('fin', .44, 'نمو المصروف التشغيلي أسرع من الإيراد الذاتي', 'Operating cost growing faster than own revenue',
      'سقف تشغيلي مرتبط بنمو الإيراد', 'An operating ceiling tied to revenue growth'),
    P('wst', .3, 'عقود النفايات هي أكبر بند تشغيلي', 'Waste contracts are the largest operating line',
      'إعادة تسعير على أساس الأطنان لا المساحة', 'Re-price by tonnage rather than by area'),
    P('mnt', .26, 'صيانة تفاعلية أعلى كلفة من الوقائية', 'Reactive maintenance costs more than preventive',
      'التحول إلى صيانة وقائية مجدولة', 'Shift to scheduled preventive maintenance')],
  /* ---- privatization ---- */
  privsh: [P('wst', .34, 'خدمات النفايات هي الأكبر ضمن نطاق التخصيص', 'Waste services are the largest privatisation scope',
      'توسيع التغطية التعاقدية للنطاقات غير المخدومة', 'Extend contract coverage to unserved zones'),
    P('cln', .28, 'نظافة الطرق قابلة للتخصيص الكامل', 'Street cleansing is fully outsourceable',
      'حزم تعاقدية على مستوى الأمانة', 'Contract packages at Amana level'),
    P('mnt', .22, 'صيانة الأصول جزئية التخصيص', 'Asset maintenance only partly outsourced',
      'عقود أداء طويلة الأجل بمؤشرات حالة', 'Long-term performance contracts with condition indicators'),
    P('fin', .16, 'دليل خدمات غير مصنَّف بوضوح', 'A service catalogue without clear classification',
      'تصنيف كل خدمة بنمط تقديم محدد', 'Classify every service with a defined delivery mode')],
  privfin: [P('fin', .5, 'قيمة العقود والوفر غير مقاسة', 'Contract value and savings not measured',
      'قياس الوفر مقابل كلفة التنفيذ الداخلي', 'Measure savings against the in-house cost baseline'),
    P('wst', .28, 'عقود قائمة دون مؤشرات وفر', 'Existing contracts with no savings indicators',
      'مؤشرات وفر إلزامية في كل عقد جديد', 'Mandatory savings indicators in every new contract'),
    P('cln', .22, 'تسعير غير مرتبط بالنتيجة', 'Pricing not linked to outcome',
      'الدفع مقابل النتيجة المرصودة', 'Payment against verified outcome')],
  /* ---- urban / housing / resilience ---- */
  acc800: [P('plan', .44, 'توزيع الأماكن العامة لا يتبع الكثافة السكانية', 'Public-space distribution does not follow population density',
      'استهداف الأحياء ذات أعلى نقص في الوصول', 'Target the districts with the largest access deficit'),
    P('dev', .3, 'تطوير سكني دون تخصيص مساحات عامة', 'Residential development with no public-space allocation',
      'نسبة إلزامية للمساحات العامة في كل مخطط', 'A mandatory public-space ratio in every layout'),
    P('mnt', .26, 'حدائق قائمة غير صالحة للاستخدام', 'Existing parks not fit for use',
      'إعادة تأهيل قبل إنشاء مواقع جديدة', 'Rehabilitate before building new sites')],
  densb: [P('plan', .56, 'نطاق عمراني أوسع من الحاجة الفعلية', 'An urban boundary wider than actual need',
      'مراجعة النطاق وربط التوسع بالإشغال', 'Review the boundary and tie expansion to occupancy'),
    P('dev', .44, 'أراضٍ مطوَّرة غير مبنية', 'Developed land left unbuilt',
      'رسوم الأراضي البيضاء المرتبطة بمدة البقاء', 'White-land fees tied to how long the plot stays idle')],
  densu: [P('plan', .58, 'كتلة عمرانية مبعثرة تزيد كلفة الخدمة', 'A scattered built-up mass raising the cost to serve',
      'تكثيف موجَّه على محاور النقل', 'Directed densification along transport corridors'),
    P('dev', .42, 'أنماط بناء منخفضة الكثافة', 'Low-density building patterns',
      'حوافز للأنماط متوسطة الكثافة', 'Incentives for medium-density typologies')],
  hexp: [P('plan', .52, 'توسع أفقي أسرع من نمو السكان', 'Horizontal expansion outpacing population growth',
      'سقف سنوي للتوسع مرتبط بالإشغال', 'An annual expansion cap tied to occupancy'),
    P('dev', .48, 'ضغط تطويري نحو الأطراف', 'Development pressure pushing to the edges',
      'إعادة توجيه الحوافز نحو الأراضي الداخلية', 'Redirect incentives toward infill land')],
  own: [P('plan', .38, 'عرض أراضٍ سكنية دون الحاجة', 'Residential land supply below need',
      'إفراج مجدول عن الأراضي المخططة', 'A scheduled release of planned land'),
    P('dev', .34, 'منتجات سكنية لا تناسب القدرة الشرائية', 'Housing products misaligned with affordability',
      'اشتراط نسبة من الوحدات ميسورة التكلفة', 'Require a share of affordable units'),
    P('fin', .28, 'حلول تمويلية محدودة', 'Limited financing pathways',
      'برامج تمويل مدعومة للفئات المستهدفة', 'Subsidised financing programmes for the target groups')],
  devu: [P('plan', .5, 'أراضٍ مخصصة للإسكان التنموي غير مهيأة', 'Land allocated to developmental housing not serviced',
      'تهيئة الخدمات قبل التخصيص', 'Service the land before allocation'),
    P('dev', .5, 'تنفيذ متأخر عن الجدول', 'Delivery behind schedule',
      'جزاءات تأخير مرتبطة بتسليم الوحدات', 'Delay penalties tied to unit handover')],
  smood: [P('prj', .4, 'خطط الاستجابة غير مختبرة ميدانيًا', 'Response plans not field-tested',
      'تمرين فرضي سنوي لكل سيناريو', 'An annual live exercise for each scenario'),
    P('util', .32, 'اعتماد على جهات خارجية دون اتفاقيات', 'Dependence on external agencies with no agreements',
      'اتفاقيات مستوى خدمة للأزمات', 'Crisis-grade service-level agreements'),
    P('mnt', .28, 'أصول حرجة دون خطة استمرارية', 'Critical assets with no continuity plan',
      'خطة استمرارية لكل أصل حرج', 'A continuity plan for every critical asset')],
};
/* domain fallbacks for anything not mapped explicitly */
const WHODEF = {
  fin: ['fin', 'lic', 'enf'], infra: ['mnt', 'util', 'prj'], reg: ['insp', 'enf', 'food', 'ret'],
  priv: ['wst', 'cln', 'mnt'], vis: ['wst', 'adv', 'cln'], svc: ['lic', 'insp', 'ret'],
  waste: ['wst', 'cd', 'cln'], res: ['prj', 'util', 'mnt'], urb: ['plan', 'dev'], hou: ['plan', 'dev'],
};
/* ---------- contribution model ---------- */
function whoFor(uid, dom, kid) {
  let list = WHOMAP[kid];
  if (!list) {
    const ids = WHODEF[dom] || WHODEF.reg;
    const base = 1 / ids.length;
    list = ids.map(p => P(p, base, 'أثر تشغيلي على هذا المؤشر', 'An operational effect on this KPI',
      'مراجعة مستوى الخدمة المتعاقد عليه', 'Review the contracted service level'));
  }
  const r = rng(uid + (dom || '-') + kid + 'who');
  const rows = list.map((x, i) => {
    const pt = PTY[x.p] || { ic: '•', k: 'i', ar: x.p, en: x.p, pre: 'X', dom: dom };
    const w = Math.max(.02, x.w * (.82 + r() * .36));
    return { ...x, pt, w,
      id: pt.pre + '-' + (1200 + ((h32(uid + kid + x.p)) % 8600)),
      n: Math.round(popF(uid) * (30 + r() * 340) * (x.w * 2.2 + .3)),
      br: clamp(8 + r() * 34, 5, 46),
      cross: pt.dom && dom && pt.dom !== dom };
  });
  const tot = rows.reduce((s, x) => s + x.w, 0) || 1;
  rows.forEach(x => x.sh = x.w / tot * 100);
  return rows.sort((a, b) => b.sh - a.sh);
}

/* --- source lines 5613-5624 --- */
Object.assign(I18N.ar, {
  ov_ttl: 'الأداء العام', ov_sub: 'متوسط', ov_dom: 'نطاقات',
  ov_need: 'تحتاج انتباهك', ov_of: 'من', ov_all: 'كل النطاقات على المسار',
  ds_sum: 'المؤشر الموجز للنطاق', ds_ok: 'ضمن المستهدف', ds_need: 'دون المستهدف',
  ds_tot: 'إجمالي المؤشرات', ds_worst: 'أبعد مؤشر عن مستهدفه', ds_trend: 'اتجاه ٨ فترات',
});
Object.assign(I18N.en, {
  ov_ttl: 'Overall performance', ov_sub: 'average of', ov_dom: 'domains',
  ov_need: 'need attention', ov_of: 'of', ov_all: 'All domains on track',
  ds_sum: 'Domain summary KPI', ds_ok: 'on target', ds_need: 'below target',
  ds_tot: 'KPIs in total', ds_worst: 'Furthest from target', ds_trend: '8-period trend',
});

/* --- source lines 5754-5813 --- */
Object.assign(I18N.ar, {
  mn_ttl: 'مرصد المدينة', mn_sub: 'الأحداث المتداولة الآن',
  mn_plan: 'نشاط مخطَّط', mn_adhoc: 'تنبيه طارئ', mn_flag: 'يحتاج انتباهك',
  mn_open: 'الحالة الكاملة ↗', mn_prev: 'السابق', mn_next: 'التالي',
  mn_play: 'إيقاف التبديل', mn_pause: 'استئناف التبديل',
  mn_state: 'الحالة الآن', mn_risk: 'مؤشر مرتبط دون المستهدف', mn_lastin: 'آخر تفتيش',
  mn_tl: 'مسار الحدث والحالة الآن', mn_map: 'موقع الحدث',
  mn_det: 'تفاصيل الحدث والأدلة المصوّرة', mn_acts: 'ما اتخذته الأمانة',
  mn_esc: 'التصعيد', mn_kpis: 'مؤشرات النطاق المرتبطة بالحدث', mn_insp: 'سجل التفتيش',
  mn_prev: 'منع التكرار', mn_prev_n: 'إجراءات تغلق الفجوة التي سمحت بوقوع الحدث — لا تعالج الحدث نفسه',
  mn_cmt: 'اعتماد', mn_cmtd: 'معتمد', mn_cmt_tl: 'اعتماد إجراء وقائي',
  mn_sc_site: 'المنشأة', mn_sc_city: 'على مستوى المدينة', mn_sc_reg: 'على مستوى المنطقة', mn_sc_ksa: 'على مستوى المملكة',
  mn_pvn: 'معتمدة',
  mn_src: 'المصدر', mn_cat: 'التصنيف', mn_am: 'الأمانة',
  mn_crisis: 'تحويل إلى إدارة الأزمات', mn_social: 'تحويل إلى إدارة منصات التواصل',
  mn_esc_d1: 'يفتح غرفة عمليات ويُلزم بتقرير كل ٦ ساعات',
  mn_esc_d2: 'يفعّل الرد الرسمي ومتابعة التداول على المنصات',
  mn_escd: 'تم التحويل', mn_now: 'جارٍ التنفيذ', mn_done: 'مكتمل', mn_wait: 'قادم',
  mn_days: 'يومًا', mn_ago: 'مضى', mn_res: 'النتيجة', mn_by: 'الجهة',
  mn_lic: 'رقم الرخصة', mn_biz: 'المنشأة أو الموقع', mn_na: 'لا ينطبق — حدث متعدد المواقع',
  mn_weak: 'ضعيف — مرتبط مباشرة بالحدث', mn_ok: 'ضمن المستهدف',
  mn_slice: 'الشريحة المعنية بالحدث', mn_city: 'على مستوى المدينة',
  mn_lens: 'بلدي لِنس', mn_media: 'إعلام ومنصات', mn_sim: 'صورة توضيحية — نموذج أولي',
  mn_src: 'من المصدر المتداول', mn_srcn: 'المقطع والإطار من المنشور المتداول على منصة X',
  mn_sim2: 'بقية الصور توضيحية — نموذج أولي', mn_open: 'اضغط للعرض بالحجم الكامل',
  mn_stale: 'التفتيش الأخير قديم مقابل دورة المتابعة المطلوبة',
  mn_of: 'من', mn_ven: 'ملعبًا', mn_close: 'إغلاق',
  mn_esc_tl: 'تم تحويل الحدث للجهة المختصة',
  mn_more: 'حدثًا آخر في شاشة الأحداث الحرجة',
});
Object.assign(I18N.en, {
  mn_ttl: 'City Monitor', mn_sub: 'Trending in the city now',
  mn_plan: 'Planned activity', mn_adhoc: 'Ad-hoc alert', mn_flag: 'Needs attention',
  mn_open: 'Full situation ↗', mn_prev: 'Previous', mn_next: 'Next',
  mn_play: 'Pause rotation', mn_pause: 'Resume rotation',
  mn_state: 'Status now', mn_risk: 'Related KPI below target', mn_lastin: 'Last inspection',
  mn_tl: 'Event timeline and current situation', mn_map: 'Event location',
  mn_det: 'Event detail and visual evidence', mn_acts: 'Actions taken by the Amana',
  mn_esc: 'Escalation', mn_kpis: 'Area KPIs related to this event', mn_insp: 'Inspection record',
  mn_prev: 'Prevention — so it does not recur', mn_prev_n: 'Actions that close the gap which allowed the event — not the event itself',
  mn_cmt: 'Commit', mn_cmtd: 'Committed', mn_cmt_tl: 'Preventive action committed',
  mn_sc_site: 'This establishment', mn_sc_city: 'City-wide', mn_sc_reg: 'Region-wide', mn_sc_ksa: 'Kingdom-wide',
  mn_pvn: 'committed',
  mn_src: 'Source', mn_cat: 'Category', mn_am: 'Amana',
  mn_crisis: 'Move to crisis management', mn_social: 'Move to social media management',
  mn_esc_d1: 'Opens an operations room and requires a report every 6 hours',
  mn_esc_d2: 'Activates the official response and tracks the conversation on platforms',
  mn_escd: 'Escalated', mn_now: 'In progress', mn_done: 'Done', mn_wait: 'Upcoming',
  mn_days: 'days', mn_ago: 'ago', mn_res: 'Result', mn_by: 'Carried out by',
  mn_lic: 'Licence no.', mn_biz: 'Establishment or site', mn_na: 'Not applicable — multi-site event',
  mn_weak: 'Weak — directly linked to this event', mn_ok: 'On target',
  mn_slice: 'The slice this event concerns', mn_city: 'city-wide',
  mn_lens: 'BaladyLens', mn_media: 'Media & platforms', mn_sim: 'Illustrative image — prototype',
  mn_src: 'From the circulating source', mn_srcn: 'Clip and frame from the circulating post on X',
  mn_sim2: 'remaining tiles are illustrative — prototype', mn_open: 'Click to view full size',
  mn_stale: 'Last inspection is stale against the required monitoring cycle',
  mn_of: 'of', mn_ven: 'stadiums', mn_close: 'Close',
  mn_esc_tl: 'Event handed to the responsible unit',
  mn_more: 'more events on the Critical Events screen',
});

/* --- source lines 5815-5827 --- */
/* ---------- helpers ---------- */
function TL(tAr, tEn, ar, en, st) { return { tAr, tEn, ar, en, st }; }
function MD(kind, scene, ar, en, a) { return { kind, scene, ar, en, a }; }
/* a = { t:'vid'|'img', k:<ASSET key>, p:<poster key> } — a real captured
   frame or clip; without it the tile falls back to the illustrative SVG */
function AC(ar, en, whenAr, whenEn, byAr, byEn) { return { ar, en, whenAr, whenEn, byAr, byEn }; }
/* a preventive action: systemic, owned, dated, and scoped — 'site' fixes this
   establishment, 'ksa' stops the same event happening in another city.
   `on` flips when an executive commits to it. */
function PV(ar, en, byAr, byEn, dueAr, dueEn, sc, effAr, effEn) {
  return { ar, en, byAr, byEn, dueAr, dueEn, sc, effAr, effEn, on: false };
}
function MK(dom, k) { return { dom, k }; }

/* --- source lines 5829-6164 --- */
/* ---------- the events ---------- */
const MON = [
  {
    id: 'taif', kind: 'adhoc', sev: 4, esc: {},
    ar: 'سقوط أجزاء من لعبة ترفيهية في منتزه الجبل الأخضر',
    en: 'Parts fell from a ride at Al Jabal Al Akhdar resort',
    amAr: 'أمانة الطائف', amEn: 'Taif Amana', uid: 'C:Makkah/الطائف',
    catAr: 'سلامة المرافق الترفيهية', catEn: 'Recreational facility safety',
    ll: [21.2854, 40.4183], zoom: 13,
    src: { u: 'https://x.com/Eyaaaad/status/1950704949941403680?lang=ar', pAr: 'منشور متداول على منصة X', pEn: 'Trending post on X' },
    biz: { ar: 'منتزه الجبل الأخضر — منطقة الألعاب', en: 'Al Jabal Al Akhdar resort — rides area', lic: 'H-48221' },
    insp: { d: 214, resAr: 'مطابق', resEn: 'Compliant', byAr: 'فرق التفتيش — أمانة الطائف', byEn: 'Inspection teams — Taif Amana', stale: true },
    detAr: ['مقطع متداول يُظهر سقوط أجزاء معدنية من إحدى الألعاب أثناء التشغيل داخل المنتزه، دون إصابات مؤكدة حتى الآن.',
      'تم التحقق من الموقع عبر صور بلدي لِنس ومطابقته مع رخصة النشاط الترفيهي القائمة في النطاق.',
      'اللعبة من فئة الألعاب الميكانيكية عالية المخاطر، وتتطلب فحصًا هندسيًا دوريًا موثقًا لكل موسم تشغيل.'],
    detEn: ['A circulating video shows metal parts detaching from a ride during operation inside the resort; no injuries confirmed so far.',
      'The location was verified through BaladyLens imagery and matched to the active recreational licence in the zone.',
      'The ride is a high-risk mechanical category requiring a documented engineering inspection each operating season.'],
    tl: [
      TL('اليوم ٠٩:١٤', 'Today 09:14', 'رصد المحتوى المتداول عبر الاستماع الاجتماعي', 'Trending content detected by social listening', 'done'),
      TL('٠٩:٤١', '09:41', 'التحقق من الموقع والمنشأة عبر بلدي لِنس', 'Location and establishment verified via BaladyLens', 'done'),
      TL('١٠:٢٦', '10:26', 'إيقاف تشغيل اللعبة وتسييج المحيط', 'Ride shut down and perimeter fenced', 'done'),
      TL('١١:٥٠', '11:50', 'فحص هندسي للألعاب المشابهة في الموقع', 'Engineering check of similar rides on site', 'now'),
      TL('غدًا', 'Tomorrow', 'تقرير السلامة النهائي وقرار إعادة التشغيل', 'Final safety report and restart decision', 'wait'),
    ],
    media: [MD('media', 'ride', 'المقطع المتداول — اللعبة أثناء التشغيل', 'The circulating clip — the ride in operation',
        { t: 'vid', k: 'taif_clip', p: 'taif_poster' }),
      MD('media', 'ride', 'إطار من المقطع — منطقة الألعاب والزوار', 'Frame from the clip — rides area and visitors',
        { t: 'img', k: 'taif_still' }),
      MD('lens', 'fence', 'بلدي لِنس — التسييج بعد الإيقاف', 'BaladyLens — fencing after shutdown')],
    acts: [
      AC('إيقاف فوري لتشغيل اللعبة', 'Immediate shutdown of the ride', 'منذ ساعتين', '2 hours ago', 'إدارة الرقابة والسلامة', 'Control & Safety Dept.'),
      AC('إشعار المشغل بإيقاف النشاط حتى اكتمال الفحص', 'Operator notified to halt activity until the inspection completes', 'منذ ساعتين', '2 hours ago', 'إدارة التراخيص', 'Licensing Dept.'),
      AC('فتح محضر مخالفة اشتراطات السلامة', 'Safety-requirement violation report opened', 'منذ ٩٠ دقيقة', '90 minutes ago', 'وحدة الإنفاذ', 'Enforcement Unit'),
    ],
    prev: [
      PV('فحص هندسي معتمد قبل كل موسم تشغيل — كشرط في الرخصة',
        'Certified engineering inspection before every operating season — as a licence condition',
        'التراخيص والسلامة', 'Licensing & Safety', 'خلال ٣٠ يومًا', 'Within 30 days', 'city',
        'يغطي كل الألعاب عالية المخاطر المرخّصة في الطائف', 'Covers every high-risk ride licensed in Taif'),
      PV('رفع تغطية التفتيش للألعاب عالية المخاطر من ٤١٪ إلى ٩٠٪',
        'Raise inspection coverage of high-risk rides from 41% to 90%',
        'فرق التفتيش', 'Inspection teams', 'قبل نهاية الموسم', 'Before season end', 'city',
        'الشريحة التي سمحت بوقوع الحدث', 'The slice that allowed this event'),
      PV('ربط تجديد الرخصة بشهادة صيانة من الشركة المصنّعة',
        'Tie licence renewal to a manufacturer maintenance certificate',
        'إدارة التراخيص', 'Licensing Dept.', 'دورة التجديد القادمة', 'Next renewal cycle', 'city'),
      PV('تعميم على الأمانات: حصر الألعاب المماثلة وفحصها',
        'Circular to all Amanas: inventory and inspect identical ride models',
        'الوزارة — وكالة البلديات', 'Ministry — Municipalities', 'خلال ٧ أيام', 'Within 7 days', 'ksa',
        'يمنع تكرار الحدث نفسه في مدينة أخرى', 'Stops the same event recurring in another city'),
    ],
    sub: { ar: 'تغطية التفتيش — الألعاب الميكانيكية عالية المخاطر', en: 'Inspection coverage — high-risk mechanical rides',
      v: 41, tgt: 90, u: '%', dom: 'reg', k: 'cov',
      nAr: 'المرافق المفتّشة خلال موسم التشغيل الحالي من إجمالي المرخّصة في الطائف',
      nEn: 'Facilities inspected in the current operating season out of all licensed in Taif' },
    kpis: [MK('reg', 'cov'), MK('reg', 'comp'), MK('reg', 'enf'), MK('svc', 'sat')],
    kpiNote: { ar: 'التغطية على مستوى المدينة ضمن المستهدف، لكن الشريحة المعنية بالحدث — الألعاب الميكانيكية عالية المخاطر — بعيدة عنه. هذه هي الفجوة التي سمحت بوقوع الحدث.',
      en: 'City-wide coverage is on target, but the slice this event concerns — high-risk mechanical rides — is far from it. That is the gap that allowed this event.' },
  },
  {
    id: 'qassim', kind: 'adhoc', sev: 3, esc: {},
    ar: 'بلاغات عن حالات تسمم غذائي مشتبهة في نطاق بريدة',
    en: 'Reports of suspected food-poisoning cases in the Buraidah zone',
    amAr: 'أمانة القصيم', amEn: 'Qassim Amana', uid: 'C:Qassim/بريدة',
    catAr: 'الرقابة الصحية على المنشآت الغذائية', catEn: 'Health control of food establishments',
    ll: [26.3260, 43.9750], zoom: 12.5,
    src: { u: 'https://x.com/NexNetnews/status/2090242415974088725', pAr: 'تداول إعلامي على منصة X', pEn: 'Media coverage on X' },
    biz: { ar: 'منشأتان غذائيتان — نطاق بريدة الأوسط', en: 'Two food establishments — central Buraidah zone', lic: 'F-19043 · F-19108' },
    insp: { d: 96, resAr: 'مطابق مع ملاحظات', resEn: 'Compliant with observations', byAr: 'الرقابة الصحية — أمانة القصيم', byEn: 'Health Control — Qassim Amana', stale: true },
    detAr: ['ارتفاع في البلاغات الصحية المرتبطة بوجبات من منشآت في النطاق نفسه خلال ٤٨ ساعة.',
      'الربط الأولي يشير إلى منشأتين تشتركان في مورّد واحد للمواد الأولية.',
      'الملاحظات المسجَّلة في آخر زيارة تفتيشية تتعلق بسلسلة التبريد وحفظ المواد الأولية.'],
    detEn: ['A rise in health reports linked to meals from establishments in the same zone within 48 hours.',
      'Initial linkage points to two establishments sharing a single raw-material supplier.',
      'Observations recorded at the last inspection concerned the chill chain and raw-material storage.'],
    tl: [
      TL('قبل ٤٨ ساعة', '48 hours ago', 'أول بلاغ صحي مرتبط بوجبة من النطاق', 'First health report linked to a meal from the zone', 'done'),
      TL('قبل ٢٤ ساعة', '24 hours ago', 'ربط البلاغات بمنشأتين ومورّد مشترك', 'Reports linked to two establishments and a shared supplier', 'done'),
      TL('اليوم', 'Today', 'زيارات تفتيشية عاجلة وسحب عينات', 'Urgent inspection visits and sampling', 'now'),
      TL('٤٨ ساعة', 'In 48 hours', 'نتائج المختبر المرجعي', 'Reference laboratory results', 'wait'),
      TL('بعد النتائج', 'After results', 'قرار الإغلاق أو خطة التصحيح', 'Closure or correction-plan decision', 'wait'),
    ],
    media: [MD('media', 'food', 'تغطية إعلامية للبلاغات', 'Media coverage of the reports'),
      MD('lens', 'food', 'بلدي لِنس — مطبخ إحدى المنشآت', 'BaladyLens — kitchen of one establishment'),
      MD('lens', 'store', 'بلدي لِنس — مستودع المواد الأولية', 'BaladyLens — raw-material store')],
    acts: [
      AC('زيارة تفتيشية عاجلة للمنشأتين', 'Urgent inspection visit to both establishments', 'اليوم ٠٨:٣٠', 'Today 08:30', 'الرقابة الصحية', 'Health Control'),
      AC('سحب عينات وإرسالها للمختبر المرجعي', 'Samples taken and sent to the reference laboratory', 'اليوم ١٠:١٥', 'Today 10:15', 'الرقابة الصحية', 'Health Control'),
      AC('تعليق تقديم الأصناف المرتبطة بالبلاغات', 'Service of the implicated items suspended', 'اليوم ١١:٠٠', 'Today 11:00', 'إدارة التراخيص', 'Licensing Dept.'),
    ],
    prev: [
      PV('إعادة تفتيش كل منشأة تشترك في المورّد نفسه',
        'Re-inspect every establishment sharing the same supplier',
        'الرقابة الصحية', 'Health Control', 'خلال ١٤ يومًا', 'Within 14 days', 'reg',
        'يقطع مسار التلوث قبل أن يتكرر', 'Cuts the contamination path before it repeats'),
      PV('تسجيل حراري متصل لسلسلة التبريد في المنشآت عالية المخاطر',
        'Continuous temperature logging on the chill chain in high-risk establishments',
        'الرقابة الصحية', 'Health Control', 'خلال ٤٥ يومًا', 'Within 45 days', 'city',
        'يحوّل الاشتراط من زيارة دورية إلى قياس مستمر', 'Turns the requirement from a periodic visit into a continuous measure'),
      PV('ربط تجديد الرخصة بشهادة تدريب سلامة غذائية سارية للعاملين',
        'Tie licence renewal to valid food-safety training certificates for staff',
        'إدارة التراخيص', 'Licensing Dept.', 'دورة التجديد القادمة', 'Next renewal cycle', 'city'),
      PV('تتبّع المورّد على مستوى المنطقة وربطه بسجل المخالفات',
        'Region-wide supplier tracing linked to the violation record',
        'الرقابة الصحية والتراخيص', 'Health Control & Licensing', 'خلال ٣٠ يومًا', 'Within 30 days', 'reg'),
    ],
    sub: { ar: 'الالتزام باشتراطات سلسلة التبريد — المنشآت الغذائية', en: 'Chill-chain compliance — food establishments',
      v: 58, tgt: 85, u: '%', dom: 'reg', k: 'comp',
      nAr: 'المنشآت الغذائية المستوفية لاشتراطات سلسلة التبريد في نطاق بريدة الأوسط',
      nEn: 'Food establishments meeting chill-chain requirements in the central Buraidah zone' },
    kpis: [MK('reg', 'comp'), MK('reg', 'cov'), MK('reg', 'enf'), MK('svc', 'satsv')],
    kpiNote: { ar: 'الملاحظات المسجَّلة في آخر زيارة كانت على سلسلة التبريد نفسها — الشريحة التي يقيسها المؤشر أعلاه.',
      en: 'The observations recorded at the last visit concerned the chill chain itself — the slice the measure above tracks.' },
  },
  {
    id: 'asiacup', kind: 'plan', sev: 2, esc: {}, evRef: 'asiacup',
    ar: 'كأس آسيا ٢٠٢٧ — جاهزية النطاقات المحيطة بالملاعب',
    en: 'AFC Asian Cup 2027 — readiness of the zones around the stadiums',
    amAr: 'الرياض · جدة · المنطقة الشرقية', amEn: 'Riyadh · Jeddah · Eastern Region', uid: 'C:Riyadh/الرياض',
    catAr: 'حدث وطني مخطَّط — مراقبة عالية التكرار', catEn: 'Planned national event — high-frequency monitoring',
    ll: [24.7913, 46.8386], zoom: 5.4, multi: true,
    src: { u: null, pAr: 'خطة الاستضافة — الاتحاد الآسيوي', pEn: 'Hosting plan — AFC' },
    biz: { ar: '٨ ملاعب في ٣ أمانات', en: '8 stadiums across 3 Amanas', lic: null },
    insp: null,
    detAr: ['الحدث يمتد على ٨ ملاعب في ٣ أمانات، ويرفع الطلب على الرقابة البلدية في نطاق كيلومترين حول كل ملعب.',
      'أربعة مسارات تُراقب بوتيرة يومية خلال الحدث: التفتيش على المنشآت، سلامة الغذاء، عقود النفايات، وصيانة الأصول.',
      'الجاهزية تُحتسب لكل ملعب على حدة، والأدنى منها هو ما يحدد مستوى المخاطرة للحدث ككل.'],
    detEn: ['The event spans 8 stadiums in 3 Amanas and raises municipal control demand within a 2 km ring around each venue.',
      'Four tracks are monitored daily during the event: establishment inspection, food safety, waste contracts and asset maintenance.',
      'Readiness is computed per stadium, and the lowest of them sets the risk level for the event as a whole.'],
    tl: [
      TL('مكتمل', 'Complete', 'إقرار المدن والملاعب المستضيفة', 'Host cities and stadiums confirmed', 'done'),
      TL('مكتمل', 'Complete', 'خطة الرقابة المكثفة للنطاقات المحيطة', 'Intensified control plan for the surrounding zones', 'done'),
      TL('مكتمل', 'Complete', 'جولة تقييم جاهزية أولى لكل الملاعب', 'First readiness assessment round across all stadiums', 'done'),
      TL('جارٍ', 'Ongoing', 'رفع وتيرة التفتيش إلى يومي قبل ٣٠ يومًا من الانطلاق', 'Inspection frequency raised to daily 30 days before kick-off', 'now'),
      TL('يناير ٢٠٢٧', 'Jan 2027', 'التشغيل الفعلي ومتابعة لحظية لكل مباراة', 'Live operation with per-fixture monitoring', 'wait'),
    ],
    media: [MD('media', 'stadium', 'الملاعب المستضيفة', 'Host stadiums'),
      MD('lens', 'stadium', 'بلدي لِنس — محيط الملعب', 'BaladyLens — stadium surroundings'),
      MD('lens', 'street', 'بلدي لِنس — مسارات الوصول', 'BaladyLens — access routes')],
    acts: [
      AC('تخصيص فرق تفتيش دائمة لكل ملعب', 'Permanent inspection teams assigned per stadium', 'هذا الشهر', 'This month', 'الأمانات الثلاث', 'The three Amanas'),
      AC('رفع مستوى خدمة عقود النظافة في نطاق ٢ كم', 'Cleansing contract service level raised within the 2 km ring', 'هذا الشهر', 'This month', 'إدارة العقود', 'Contract Management'),
      AC('جدول صيانة وقائية للأصول المحيطة', 'Preventive maintenance schedule for surrounding assets', 'هذا الشهر', 'This month', 'إدارة الأصول', 'Asset Management'),
    ],
    prev: [
      PV('بوابة جاهزية إلزامية قبل ٦ أسابيع من كل مباراة',
        'Mandatory readiness gate six weeks before every match',
        'الأمانات الثلاث', 'The three Amanas', 'قبل كل مباراة', 'Before each match', 'city',
        'يمنع اكتشاف النقص في يوم المباراة', 'Stops a shortfall being discovered on match day'),
      PV('توحيد اشتراطات الجاهزية بين الأمانات الثلاث',
        'One readiness standard across the three Amanas',
        'الوزارة', 'Ministry', 'خلال ٣٠ يومًا', 'Within 30 days', 'ksa'),
      PV('صيانة وقائية مجدولة لأصول نطاق ٢ كم حول كل ملعب',
        'Scheduled preventive maintenance of assets in the 2 km ring around each stadium',
        'إدارة الأصول', 'Asset Management', 'دورة شهرية', 'Monthly cycle', 'city'),
      PV('تمرين محاكاة لأسوأ سيناريو تشغيلي لكل ملعب',
        'Worst-case operational drill per stadium',
        'العمليات', 'Operations', 'خلال ٦٠ يومًا', 'Within 60 days', 'city'),
    ],
    sub: { ar: 'جاهزية أدنى ملعب من الملاعب الثمانية', en: 'Readiness of the lowest of the eight stadiums',
      v: null, tgt: 90, u: '%', dom: 'reg', k: 'cov', fromVenues: true,
      nAr: 'الجاهزية تُحتسب لكل ملعب، والأدنى منها هو ما يحدد مخاطرة الحدث ككل',
      nEn: 'Readiness is computed per stadium; the lowest one sets the risk for the whole event' },
    kpis: [MK('reg', 'cov'), MK('reg', 'comp'), MK('waste', 'perfc'), MK('infra', 'pave')],
    kpiNote: { ar: 'المؤشرات تُقاس على مستوى المدن المستضيفة، وترتفع وتيرة قياسها إلى يومي خلال الحدث.',
      en: 'These KPIs are measured at host-city level, and their measurement frequency rises to daily during the event.' },
  },
];

/* ---- three more trending events so the strip has real depth ---- */
MON.push(
  {
    id: 'jeddah', kind: 'adhoc', sev: 4, esc: {},
    ar: 'سقوط أجزاء من واجهة مبنى قائم — الشرفية', en: 'Façade sections fell from an existing building — Ash Sharafiyah',
    amAr: 'أمانة جدة', amEn: 'Jeddah Amana', uid: 'C:Makkah/جدة',
    catAr: 'السلامة الإنشائية للمباني القائمة', catEn: 'Structural safety of existing buildings',
    ll: [21.516, 39.176], zoom: 14,
    src: { u: null, pAr: 'بلاغ ميداني وتغطية إعلامية', pEn: 'Field report and media coverage' },
    biz: { ar: 'مبنى سكني قائم منذ ١٩٧٩ — حي الشرفية', en: 'Residential building dating to 1979 — Ash Sharafiyah district', lic: 'B-70914' },
    insp: { d: 168, resAr: 'إنذار تهالك — دون معالجة موثقة', resEn: 'Dilapidation notice — no documented remediation',
      byAr: 'السلامة الإنشائية — أمانة جدة', byEn: 'Structural Safety — Jeddah Amana', stale: true },
    detAr: ['سقوط أجزاء من واجهة مبنى سكني على الرصيف، وإخلاء ١١ أسرة وإغلاق جزئي للشارع.',
      'المبنى كان قد استلم إنذارين سابقين بشأن التهالك دون معالجة موثقة.',
      'التقييم الإنشائي العاجل صنّف المبنى غير آمن للسكن.'],
    detEn: ['Façade sections fell from a residential building onto the sidewalk; 11 households evacuated and the street partially closed.',
      'The building had received two prior dilapidation notices with no documented remediation.',
      'The urgent structural assessment classified the building unfit for occupancy.'],
    tl: [
      TL('قبل ٩ ساعات', '9 hours ago', 'بلاغ ميداني وإعلامي وفتح الحدث', 'Field and media report, event opened', 'done'),
      TL('قبل ٨ ساعات', '8 hours ago', 'تطويق الموقع وإخلاء السكان', 'Site cordoned and residents evacuated', 'done'),
      TL('قبل ٦ ساعات', '6 hours ago', 'تقييم إنشائي عاجل — غير آمن للسكن', 'Urgent structural assessment — unfit for occupancy', 'done'),
      TL('الآن', 'Now', 'إحالة لقرار الإزالة وتأمين السكن البديل', 'Referred for demolition decision and alternative housing', 'now'),
      TL('٧ أيام', 'In 7 days', 'إعادة فحص ٣٤ مبنى مُنذرًا في الحي نفسه', 'Re-inspection of 34 notified buildings in the same district', 'wait'),
    ],
    media: [MD('media', 'street', 'الواجهة بعد السقوط', 'The façade after the collapse'),
      MD('lens', 'store', 'بلدي لِنس — المبنى قبل الحادث', 'BaladyLens — the building before the incident'),
      MD('lens', 'fence', 'بلدي لِنس — التطويق والإخلاء', 'BaladyLens — cordon and evacuation')],
    acts: [
      AC('تطويق الموقع وإخلاء ١١ أسرة', 'Site cordoned and 11 households evacuated', 'قبل ٨ ساعات', '8 hours ago', 'الأمانة والدفاع المدني', 'Amana and Civil Defense'),
      AC('تقييم إنشائي عاجل', 'Urgent structural assessment', 'قبل ٦ ساعات', '6 hours ago', 'السلامة الإنشائية', 'Structural Safety'),
      AC('إحالة لقرار الإزالة على حساب المالك', 'Referred for demolition at owner cost', 'قبل ساعتين', '2 hours ago', 'وحدة الإنفاذ', 'Enforcement Unit'),
    ],
    prev: [
      PV('مسح إنشائي لكل مبنى مُنذَر دون معالجة في الحي',
        'Structural survey of every notified-but-unremediated building in the district',
        'السلامة الإنشائية', 'Structural Safety', 'خلال ٣٠ يومًا', 'Within 30 days', 'city',
        'يغلق نفس الفجوة التي أنتجت الحدث — ٣٤ مبنى', 'Closes the exact gap that produced this event — 34 buildings'),
      PV('تحويل كل إنذار إلى أمر عمل ملزم بمهلة وغرامة تصاعدية',
        'Turn every notice into a binding work order with a deadline and an escalating fine',
        'وحدة الإنفاذ', 'Enforcement Unit', 'خلال ٤٥ يومًا', 'Within 45 days', 'city',
        'الإنذار الذي لا يتحول إلى أمر عمل هو أصل الحدث', 'A notice that never becomes a work order is the origin of this event'),
      PV('تسييج وسقالات إلزامية للمباني المُنذَرة على مسارات المشاة',
        'Mandatory hoarding and scaffolding on notified buildings along pedestrian routes',
        'عمليات الأمانة', 'Municipal Operations', 'خلال ١٤ يومًا', 'Within 14 days', 'city'),
      PV('إعادة تفتيش ربع سنوية لقائمة المباني المُنذَرة',
        'Quarterly re-inspection of the notified-buildings list',
        'الوزارة — وكالة البلديات', 'Ministry — Municipalities', 'دورة ربع سنوية', 'Quarterly cycle', 'ksa'),
    ],
    sub: { ar: 'معالجة المباني المُنذَرة — حي الشرفية', en: 'Remediation of notified buildings — Ash Sharafiyah',
      v: 34, tgt: 85, u: '%', dom: 'reg', k: 'uio',
      nAr: 'المباني التي عولجت فعليًا من إجمالي المُنذَرة في الحي — ٣٤ مبنى ما زالت دون معالجة',
      nEn: 'Buildings actually remediated out of all notified in the district — 34 remain untreated' },
    kpis: [MK('reg', 'uio'), MK('reg', 'enf'), MK('reg', 'cov'), MK('infra', 'pave')],
    kpiNote: { ar: 'الإنذارات التي لا تتحول إلى أوامر عمل ملزمة هي الفجوة التي أنتجت هذا الحدث.',
      en: 'Notices that never become binding work orders are the gap that produced this event.' },
  },
  {
    id: 'clean', kind: 'adhoc', sev: 3, esc: {},
    ar: 'اتجاه متصاعد على المنصات حول نظافة الشوارع — جنوب الرياض',
    en: 'Rising platform trend on street cleanliness — south Riyadh',
    amAr: 'أمانة الرياض', amEn: 'Riyadh Amana', uid: 'C:Riyadh/الرياض',
    catAr: 'استماع اجتماعي — النظافة العامة', catEn: 'Social listening — public cleanliness',
    ll: [24.706, 46.685], zoom: 11.5,
    src: { u: null, pAr: 'استماع اجتماعي — ٨٤٢٠ إشارة في ٢٤ ساعة', pEn: 'Social listening — 8,420 mentions in 24h' },
    biz: { ar: 'ثلاثة أحياء: العزيزية · السويدي · الشفا', en: 'Three districts: Al Aziziyah · As Suwaidi · Ash Shifa', lic: null },
    insp: null,
    detAr: ['ارتفاع الإشارات من ٢٩٤٠ إلى ٨٤٢٠ إشارة خلال ٢٤ ساعة بزيادة ١٨٦٪.',
      '٧١٪ من الإشارات تشير إلى ثلاثة أحياء جنوب الرياض.',
      'الاتجاه يتوافق مع ١٢٨٤ بلاغًا بلديًا عن النظافة في النطاق نفسه خلال ٧ أيام — أي أن الإشارة حقيقية وليست تداولًا فقط.'],
    detEn: ['Mentions rose from 2,940 to 8,420 within 24 hours, up 186%.',
      '71% of mentions point to three districts in south Riyadh.',
      'The trend matches 1,284 municipal cleanliness reports in the same scope over 7 days — the signal is real, not just chatter.'],
    tl: [
      TL('قبل ٦ ساعات', '6 hours ago', 'رصد آلي لارتفاع الإشارات', 'Automated spike detection', 'done'),
      TL('قبل ٥ ساعات', '5 hours ago', 'فرز وتأكيد الموقع الجغرافي للإشارات', 'Triaged and geo-confirmed the signal cluster', 'done'),
      TL('قبل ٣ ساعات', '3 hours ago', 'إحالة إلى عمليات الأمانة والمركز الوطني لإدارة النفايات', 'Referred to municipal operations and NWMC', 'done'),
      TL('الآن', 'Now', 'نشر ٦ فرق نظافة إضافية ودورتين مسائيتين', 'Six additional cleaning crews and two evening cycles deployed', 'now'),
      TL('٤٨ ساعة', 'In 48 hours', 'قياس أثر التدخل على الإشارات والبلاغات', 'Measure intervention impact on mentions and reports', 'wait'),
    ],
    media: [MD('media', 'street', 'صور متداولة من الأحياء الثلاثة', 'Circulating images from the three districts'),
      MD('lens', 'street', 'بلدي لِنس — نقاط التكدس المرصودة', 'BaladyLens — recorded accumulation points'),
      MD('lens', 'food', 'بلدي لِنس — حاويات غير مخدومة', 'BaladyLens — unserviced bins')],
    acts: [
      AC('نشر ٦ فرق نظافة إضافية', 'Six additional cleaning crews deployed', 'قبل ساعة', '1 hour ago', 'عمليات الأمانة', 'Municipal Operations'),
      AC('إضافة دورتين مسائيتين في الأحياء الثلاثة', 'Two evening cycles added in the three districts', 'قبل ساعة', '1 hour ago', 'مشغل النظافة', 'Cleansing Operator'),
      AC('تحقق مصوّر لكل نقطة تكدس متكررة', 'Photo verification at each repeat accumulation point', 'الآن', 'Now', 'ضبط الجودة', 'Quality Assurance'),
    ],
    prev: [
      PV('ربط دفعات عقد النظافة بأداء الجمع الموثّق بالصور',
        'Tie cleansing-contract payments to photo-verified collection performance',
        'إدارة العقود', 'Contract Management', 'دورة الفوترة القادمة', 'Next invoice cycle', 'city',
        'يجعل الأداء شرط دفع لا ملاحظة تقرير', 'Makes performance a payment condition, not a report remark'),
      PV('تعديل خطة الدورات لتطابق أنماط التكدس المرصودة',
        'Re-plan collection cycles to match the observed accumulation pattern',
        'مشغل النظافة', 'Cleansing Operator', 'خلال ١٤ يومًا', 'Within 14 days', 'city'),
      PV('عيّنة تدقيق أسبوعية عبر بلدي لِنس في النقاط المتكررة',
        'Weekly BaladyLens audit sample at the repeat points',
        'ضبط الجودة', 'Quality Assurance', 'أسبوعيًا', 'Weekly', 'city'),
      PV('غرامة تعاقدية على النقطة غير المخدومة بعد إنذارين',
        'Contractual penalty per unserviced point after two notices',
        'إدارة العقود', 'Contract Management', 'خلال ٣٠ يومًا', 'Within 30 days', 'city'),
    ],
    sub: { ar: 'أداء الجمع في الأحياء الثلاثة المعنية', en: 'Collection performance in the three districts concerned',
      v: 63, tgt: 92, u: '%', dom: 'waste', k: 'perfc',
      nAr: 'الجمع المنفَّذ في موعده من إجمالي المجدول في العزيزية والسويدي والشفا',
      nEn: 'Collections executed on schedule out of all scheduled in Al Aziziyah, As Suwaidi and Ash Shifa' },
    kpis: [MK('waste', 'perfc'), MK('vis', 'vpiw'), MK('svc', 'sat'), MK('reg', 'enf')],
    kpiNote: { ar: 'الإشارات على المنصات تتبع أداء الجمع في الأحياء نفسها — معالجة الجمع تعالج الاتجاه.',
      en: 'Platform mentions track collection performance in the same districts — fixing collection fixes the trend.' },
  },
  {
    id: 'season', kind: 'plan', sev: 2, esc: {}, evRef: 'season',
    ar: 'موسم الرياض ٢٠٢٦ — جاهزية مواقع الترفيه', en: 'Riyadh Season 2026 — readiness of the entertainment sites',
    amAr: 'أمانة الرياض', amEn: 'Riyadh Amana', uid: 'C:Riyadh/الرياض',
    catAr: 'حدث مخطَّط ممتد — خمسة أشهر', catEn: 'Extended planned event — five months',
    ll: [24.7686, 46.6182], zoom: 11, multi: true,
    src: { u: null, pAr: 'الهيئة العامة للترفيه', pEn: 'General Entertainment Authority' },
    biz: { ar: 'مواقع الموسم داخل الرياض', en: 'Season sites across Riyadh', lic: null },
    insp: null,
    detAr: ['الموسم يمتد من أكتوبر ٢٠٢٦ إلى مارس ٢٠٢٧ بكثافة زوار عالية في مواقع محددة.',
      'الضغط الأكبر على الباعة الجائلين والنظافة ومسارات المشاة في محيط المواقع.',
      'المتابعة أسبوعية قبل الانطلاق وتصبح يومية بعده.'],
    detEn: ['The season runs from October 2026 to March 2027 with high visitor density at defined sites.',
      'The heaviest pressure is on street vendors, cleanliness and pedestrian routes around the sites.',
      'Monitoring is weekly before kick-off and becomes daily once it starts.'],
    tl: [
      TL('مكتمل', 'Complete', 'إقرار المواقع وخطة الرقابة', 'Sites and control plan confirmed', 'done'),
      TL('مكتمل', 'Complete', 'جولة تقييم جاهزية أولى', 'First readiness assessment round', 'done'),
      TL('جارٍ', 'Ongoing', 'معالجة ملاحظات مسارات المشاة والباعة الجائلين', 'Closing pedestrian-route and street-vendor observations', 'now'),
      TL('أكتوبر ٢٠٢٦', 'Oct 2026', 'الانطلاق ورفع المتابعة إلى يومي', 'Kick-off and monitoring raised to daily', 'wait'),
    ],
    media: [MD('media', 'stadium', 'مواقع الموسم', 'Season sites'),
      MD('lens', 'street', 'بلدي لِنس — مسارات المشاة', 'BaladyLens — pedestrian routes'),
      MD('lens', 'stadium', 'بلدي لِنس — محيط الموقع', 'BaladyLens — site surroundings')],
    acts: [
      AC('خطة ضبط للباعة الجائلين حول المواقع', 'Street-vendor control plan around the sites', 'هذا الشهر', 'This month', 'وحدة الإنفاذ', 'Enforcement Unit'),
      AC('رفع تكرار دورات النظافة في المحيط', 'Higher cleansing cycle frequency in the surroundings', 'هذا الشهر', 'This month', 'إدارة العقود', 'Contract Management'),
      AC('صيانة مسارات المشاة والإنارة', 'Maintenance of pedestrian routes and lighting', 'هذا الشهر', 'This month', 'إدارة الأصول', 'Asset Management'),
    ],
    prev: [
      PV('شهادة جاهزية الموقع قبل ٣٠ يومًا من الافتتاح — شرط للتصريح',
        'Site readiness certificate 30 days before opening — as a permit condition',
        'إدارة التراخيص', 'Licensing Dept.', 'قبل كل افتتاح', 'Before each opening', 'city',
        'ينقل الجاهزية من متابعة إلى شرط', 'Moves readiness from follow-up to a condition'),
      PV('خطة ثابتة للباعة الجائلين مع نقاط بديلة مرخّصة',
        'Standing street-vendor plan with licensed alternative pitches',
        'وحدة الإنفاذ', 'Enforcement Unit', 'خلال ٤٥ يومًا', 'Within 45 days', 'city'),
      PV('صيانة وقائية دورية لمسارات المشاة والإنارة',
        'Cyclical preventive maintenance of pedestrian routes and lighting',
        'إدارة الأصول', 'Asset Management', 'دورة شهرية', 'Monthly cycle', 'city'),
      PV('مراجعة جاهزية أسبوعية بعد الانطلاق',
        'Weekly readiness review after kick-off',
        'العمليات', 'Operations', 'أسبوعيًا', 'Weekly', 'city'),
    ],
    sub: { ar: 'جاهزية أدنى موقع من مواقع الموسم', en: 'Readiness of the lowest of the season sites',
      v: null, tgt: 90, u: '%', dom: 'reg', k: 'cov', fromVenues: true,
      nAr: 'الجاهزية تُحتسب لكل موقع، والأدنى منها يحدد مخاطرة الموسم',
      nEn: 'Readiness is computed per site; the lowest one sets the risk for the season' },
    kpis: [MK('reg', 'cov'), MK('vis', 'vpi'), MK('waste', 'perfc'), MK('infra', 'pave')],
    kpiNote: { ar: 'المؤشرات تُقاس على مستوى الرياض، وترتفع وتيرة قياسها إلى يومي بعد الانطلاق.',
      en: 'These KPIs are measured at Riyadh level, and their frequency rises to daily after kick-off.' },
  }
);
const MONBY = {}; MON.forEach(m => MONBY[m.id] = m);

/* --- source lines 6512-6524 --- */
const HS = { uid: 'KSA', dom: null, kpi: null, dim: null, vel: null, hot: null, insF: 'all', evF: 'all' };
const attKey = ['att_0', 'att_1', 'att_2', 'att_3', 'att_4'];
let hMap, hLayers = [], tileH = null, homeBooted = false;

/* ---------- small series for domain KPI sparklines ---------- */
function dSeries(uid, dom, kid) {
  const k = DOM[dom].kpis.find(x => x.id === kid);
  if (k.reg) return series(uid, kid).slice(Math.max(0, PER - 7), PER + 1);
  const v = dVal(uid, dom, kid), r = rng(uid + dom + kid + 'sp'), a = new Array(8);
  a[7] = v;
  for (let i = 6; i >= 0; i--) a[i] = a[i + 1] - ((r() * 2 - 1) * (k.u === '%' ? 1.5 : .35) + k.dir * .18 * (k.u === '%' ? 1 : .2));
  return a;
}

/* --- source lines 6884-7101 --- */
Object.assign(I18N.ar, {
  in_ttl: 'الرؤى والإجراءات', in_sub: 'عبر كل النطاقات', in_open: 'التحليل الكامل ↗',
  in_dom: 'النطاق', in_kpi: 'المؤشر المتأثر', in_loc: 'الموقع', in_per: 'الفترة',
  in_map: 'الموقع على أدنى مستوى', in_rc: 'التحليل الجذري الكامل',
  in_trend: 'سلوك المؤشر عبر الزمن', in_band: 'النطاق المعتاد', in_now: 'هذا الشهر',
  in_ctr: 'المشغل المتعاقد على النطاق', in_sla: 'أداء مستوى الخدمة',
  in_viol: 'مخالفات الأمانة على المشغل', in_cx: 'شكاوى المواطنين المرتبطة',
  in_cx3: 'تراكم ثلاثة أشهر', in_rec: 'التوصيات', in_cta: 'إجراءات التنفيذ',
  in_wi: 'ماذا لو نُفِّذت التوصية كما هي؟',
  in_before: 'الوضع الحالي', in_after: 'المتوقع بعد ٦ أسابيع', in_delta: 'الفرق',
  in_imp: 'الأثر', in_eff: 'الجهد', in_own: 'الجهة المنفِّذة',
  in_eff_l: 'منخفض', in_eff_m: 'متوسط', in_eff_h: 'مرتفع',
  in_ontime: 'الجمع في موعده', in_missed: 'جمع فائت هذا الشهر', in_resp: 'زمن الاستجابة',
  in_sla_t: 'المتعاقد عليه', in_contract: 'رقم العقد', in_scope2: 'نطاق العقد',
  in_v_warn: 'إنذار', in_v_fine: 'غرامة', in_v_ded: 'خصم من المستخلص', in_v_stop: 'إيقاف جزئي',
  in_v_open: 'قائمة', in_v_paid: 'منفَّذة', in_v_obj: 'معترض عليها',
  in_exec: 'إصدار الأمر', in_execd: 'تم الإصدار', in_cxk: 'شكوى',
  in_mo: ['قبل ٣ أشهر', 'قبل شهرين', 'الشهر الماضي'],
  in_rise: 'ارتفاع', in_vs: 'مقابل', in_avg3: 'متوسط ٣ أشهر',
  in_cxnote: 'الشكاوى تتبع النقاط نفسها التي يرصدها المؤشر — الإشارة مؤكدة من مصدرين.',
  in_wnote: 'التقديرات مبنية على أثر الإجراء المعتاد في نطاقات مشابهة — نموذج أولي.',
  in_conf: 'الثقة', in_hi: 'مرتفعة', in_mid: 'متوسطة',
  in_derived: 'تحليل مشتق من محرك المؤشرات', in_top: 'السبب الأرجح',
});
Object.assign(I18N.en, {
  in_ttl: 'Insights & Actions', in_sub: 'across all domains', in_open: 'Full analysis ↗',
  in_dom: 'Domain', in_kpi: 'Impacted KPI', in_loc: 'Location', in_per: 'Period',
  in_map: 'Location at the lowest level', in_rc: 'Full root-cause reasoning',
  in_trend: 'KPI behaviour over time', in_band: 'Usual range', in_now: 'This month',
  in_ctr: 'Contracted operator for this scope', in_sla: 'SLA performance',
  in_viol: 'Amana violations against the operator', in_cx: 'Related citizen complaints',
  in_cx3: 'Three-month accumulation', in_rec: 'Recommendations', in_cta: 'Call to action',
  in_wi: 'What if the recommendation is executed as advised?',
  in_before: 'Now', in_after: 'Expected in 6 weeks', in_delta: 'Change',
  in_imp: 'Impact', in_eff: 'Effort', in_own: 'Owner',
  in_eff_l: 'Low', in_eff_m: 'Medium', in_eff_h: 'High',
  in_ontime: 'Collections on time', in_missed: 'Missed collections this month', in_resp: 'Response time',
  in_sla_t: 'Contracted', in_contract: 'Contract no.', in_scope2: 'Contract scope',
  in_v_warn: 'Warning', in_v_fine: 'Fine', in_v_ded: 'Payment deduction', in_v_stop: 'Partial suspension',
  in_v_open: 'Open', in_v_paid: 'Executed', in_v_obj: 'Under objection',
  in_exec: 'Issue the order', in_execd: 'Order issued', in_cxk: 'complaints',
  in_mo: ['3 months ago', '2 months ago', 'Last month'],
  in_rise: 'up', in_vs: 'vs', in_avg3: '3-month average',
  in_cxnote: 'Complaints track the same points the KPI records — the signal is confirmed from two sources.',
  in_wnote: 'Estimates are based on the usual effect of this action in comparable scopes — prototype.',
  in_conf: 'Confidence', in_hi: 'High', in_mid: 'Medium',
  in_derived: 'Derived from the KPI engine', in_top: 'Most likely cause',
});

/* ---------- authored insights ---------- */
const INSX = {
  khobar_vp: {
    id: 'khobar_vp', dom: 'vis', kpi: 'vpiw', uid: 'C:Eastern Region/الخبر', sev: 4, conf: 'in_hi',
    ar: 'ارتفاع مخالفات نفايات التشوه البصري ٣٠٪ في شمال الخبر — تتمركز في حي الراكة، مع ارتباط مباشر بشكاوى المواطنين',
    en: 'Visual-pollution waste violations up 30% in north Al Khobar — concentrated in Ar Rakah district, with a direct correlation to citizen complaints',
    locAr: 'حي الراكة — شمال الخبر', locEn: 'Ar Rakah district — north Al Khobar',
    ll: [26.3372, 50.1938], zoom: 14.4,
    trend: { vals: [12, 11, 13, 12, 13, 11, 12, 13, 17], lo: 10, hi: 12, u: '/كم²', uEn: '/km²' },
    rcAr: ['المؤشر في هذا النطاق يتحرك تاريخيًا بين ١٠ و١٢ مخالفة لكل كم² شهريًا. هذا الشهر بلغ ١٧ — أعلى بنسبة ٣١٪ من الشهر الماضي وخارج النطاق المعتاد لأول مرة في تسعة أشهر.',
      'الارتفاع ليس موزعًا على المدينة: ٦٨٪ منه في حي الراكة وحده، وداخل الحي يتمركز في ست نقاط تكدس متكررة على ثلاثة شوارع.',
      'النقاط الست كلها داخل نطاق عقد جمع واحد. أداء الجمع في موعده على هذا العقد هبط إلى ٦٨٪ مقابل ٩٢٪ متعاقد عليها، مع ٢١٤ عملية جمع فائتة هذا الشهر.',
      'التسلسل السببي واضح: جمع فائت متكرر ← تكدس على نفس النقاط ← رصد كمخالفة تشوه بصري ← شكاوى مواطنين من النقاط نفسها. المؤشر والشكاوى يقيسان الحدث ذاته من مصدرين مستقلين.',
      'الأمانة أصدرت ثلاث مخالفات على المشغل خلال ٩٠ يومًا، اثنتان منها ما زالتا قائمة دون تنفيذ — أي أن الإنفاذ التعاقدي لم يترجم إلى تغيير تشغيلي.'],
    rcEn: ['In this scope the index historically moves between 10 and 12 violations per km² per month. This month it reached 17 — 31% above last month and outside the usual range for the first time in nine months.',
      'The rise is not spread across the city: 68% of it sits in Ar Rakah district alone, and within the district it concentrates in six repeat accumulation points on three streets.',
      'All six points fall inside a single collection contract. On-time collection performance on that contract dropped to 68% against a contracted 92%, with 214 missed collections this month.',
      'The causal chain is clear: repeated missed collections → accumulation at the same points → recorded as a visual-pollution violation → citizen complaints from those same points. The KPI and the complaints measure the same event from two independent sources.',
      'The Amana issued three violations against the operator within 90 days, two of which remain open and unexecuted — contractual enforcement has not translated into an operational change.'],
    ctr: { ar: 'مشغل جمع النفايات البلدية — حزمة الشرق ٣', en: 'Municipal waste collection operator — Eastern package 3',
      id: 'W-4471', scAr: 'شمال الخبر — ٧ أحياء', scEn: 'North Al Khobar — 7 districts' },
    sla: [{ ar: 'الجمع في موعده', en: 'Collections on time', v: 68, t: 92, u: '%', dir: 1 },
      { ar: 'جمع فائت هذا الشهر', en: 'Missed collections this month', v: 214, t: 40, u: '', dir: -1 },
      { ar: 'زمن الاستجابة للبلاغ', en: 'Report response time', v: 9.4, t: 4, u: 'h', dir: -1 }],
    viol: [{ kind: 'in_v_warn', dAr: 'قبل ٨٧ يومًا', dEn: '87 days ago', st: 'in_v_paid', amt: null,
        rAr: 'تكرار الجمع الفائت في حي الراكة', rEn: 'Repeated missed collections in Ar Rakah' },
      { kind: 'in_v_warn', dAr: 'قبل ٥٤ يومًا', dEn: '54 days ago', st: 'in_v_open', amt: null,
        rAr: 'عدم معالجة نقاط التكدس المتكررة', rEn: 'Repeat accumulation points not addressed' },
      { kind: 'in_v_fine', dAr: 'قبل ٢٦ يومًا', dEn: '26 days ago', st: 'in_v_open', amt: 45000,
        rAr: 'تجاوز مستوى الخدمة للشهر الثالث', rEn: 'SLA breach for a third consecutive month' }],
    cx: { m: [168, 204, 297], catAr: ['تكدس نفايات', 'حاويات غير مخدومة', 'روائح ومخلفات سائلة', 'نفايات على الرصيف'],
      catEn: ['Waste accumulation', 'Unserviced bins', 'Odour and liquid waste', 'Waste on the sidewalk'],
      cats: [41, 29, 17, 13] },
    hot: [{ ar: 'شارع الأمير سلطان — شمال', en: 'Prince Sultan St — north', n: 84, ll: [26.3410, 50.1902] },
      { ar: 'شارع الملك فهد — تقاطع الراكة', en: 'King Fahd Rd — Ar Rakah junction', n: 71, ll: [26.3356, 50.1975] },
      { ar: 'شارع الثقبة', en: 'Ath Thuqbah St', n: 58, ll: [26.3339, 50.1889] },
      { ar: 'ممشى الراكة الشمالي', en: 'North Ar Rakah promenade', n: 46, ll: [26.3441, 50.1954] },
      { ar: 'السوق المركزي — الخلفية', en: 'Central market — rear', n: 39, ll: [26.3312, 50.1931] },
      { ar: 'أرض فضاء — مخرج ٧', en: 'Vacant land — exit 7', n: 31, ll: [26.3389, 50.2011] }],
    rec: [{ ar: 'إضافة دورة جمع مسائية على النقاط الست مع تحقق مصوّر لكل نقطة',
        en: 'Add an evening collection cycle on the six points with photo verification at each',
        imp: 'in_hi', eff: 'in_eff_l', ownAr: 'مشغل الجمع — عقد W-4471', ownEn: 'Collection operator — contract W-4471' },
      { ar: 'تنفيذ الغرامة القائمة وخصمها من المستخلص الشهري',
        en: 'Execute the open fine and deduct it from the monthly payment',
        imp: 'in_hi', eff: 'in_eff_l', ownAr: 'إدارة العقود', ownEn: 'Contract Management' },
      { ar: 'إعادة توزيع جدول الجمع حسب معدل التوليد لا حسب المساحة',
        en: 'Rebalance the collection schedule by generation rate rather than by area',
        imp: 'in_mid', eff: 'in_eff_m', ownAr: 'عمليات الأمانة', ownEn: 'Municipal Operations' },
      { ar: 'تحويل العقد إلى الدفع مقابل النتيجة المرصودة عند التجديد',
        en: 'Move the contract to payment against verified outcome at renewal',
        imp: 'in_hi', eff: 'in_eff_h', ownAr: 'إدارة العقود', ownEn: 'Contract Management' }],
    cta: [{ ar: 'إصدار أمر تصحيح ملزم للمشغل — ٧ أيام', en: 'Issue a binding correction order to the operator — 7 days', k: 'order' },
      { ar: 'تنفيذ الخصم من المستخلص الشهري', en: 'Execute the deduction from the monthly payment', k: 'deduct' },
      { ar: 'حملة ميدانية مشتركة على النقاط الست', en: 'Joint field campaign on the six points', k: 'campaign' }],
    wi: [{ ar: 'مخالفات نفايات التشوه البصري', en: 'VP waste violations', b: 17, a: 12.4, u: '/كم²', uEn: '/km²', dir: -1 },
      { ar: 'الجمع في موعده', en: 'Collections on time', b: 68, a: 88, u: '%', uEn: '%', dir: 1 },
      { ar: 'شكاوى المواطنين شهريًا', en: 'Citizen complaints per month', b: 297, a: 184, u: '', uEn: '', dir: -1 },
      { ar: 'نقاط التكدس المتكررة', en: 'Repeat accumulation points', b: 6, a: 2, u: '', uEn: '', dir: -1 }],
    wiAr: 'التقدير مبني على أثر الدورة المسائية والتحقق المصوّر في نطاقات مشابهة: النقاط المتكررة تنخفض من ست إلى اثنتين خلال ست أسابيع، ويعود المؤشر إلى داخل النطاق المعتاد دون تجاوز المستهدف.',
    wiEn: 'The estimate is based on the effect of an evening cycle plus photo verification in comparable scopes: repeat points fall from six to two within six weeks and the index returns inside its usual range, though still above target.',
  },
};
const insInScope = (x, uid) => {
  if (x.uid === uid) return true;
  let u = U[x.uid];
  while (u && u.p) { if (u.p === uid) return true; u = U[u.p]; }
  return uid === 'KSA';
};

/* ---------- derive a full analysis for any engine-generated insight ---------- */
function insDerive(g) {
  /* the headline number is computed at the current scope; the location is where the gap concentrates */
  const uid = HS.uid, lid = (g.loc && g.loc.id) || uid, k = DOM[g.dom].kpis.find(x => x.id === g.kpi);
  const v = dVal(uid, g.dom, g.kpi), t = dT(uid, k), r = rng(uid + g.dom + g.kpi + 'ins');
  const ser = (typeof dSeries === 'function' ? dSeries(uid, g.dom, g.kpi) : [v]).map(x => x);
  /* usual range = mean ± 1 sd of the prior periods, so "outside the range" means something */
  const pre = ser.slice(0, -1), mu = pre.reduce((a, b) => a + b, 0) / Math.max(1, pre.length);
  const sd = Math.sqrt(pre.reduce((a, b) => a + (b - mu) * (b - mu), 0) / Math.max(1, pre.length)) || Math.abs(mu) * .04;
  const lo = mu - sd, hi = mu + sd;
  const parties = (typeof whoFor === 'function' ? whoFor(lid, g.dom, g.kpi) : []).slice(0, 3);
  const p0 = parties[0];
  const cxr = (typeof at === 'function' ? at(lid, 'cx') : 12);
  const base = Math.max(40, Math.round(cxr * clamp(popF(lid), .2, 6) * 14));
  const cx = [Math.round(base * .72), Math.round(base * .88), base];
  const drv = (typeof driversFor === 'function' && typeof DRIVERS !== 'undefined' && DRIVERS[g.kpi])
    ? driversFor(uid, g.kpi).slice(0, 4) : [];
  const gapAbs = Math.abs(dGap(k, v, t));
  return {
    derived: true, id: g.id, dom: g.dom, kpi: g.kpi, uid, lid, sev: g.sev, conf: 'in_mid',
    ar: g.ar, en: g.en, locAr: nm(U[lid]), locEn: nm(U[lid]),
    ll: (U[lid] && U[lid].c) || [24.7, 46.7], zoom: U[lid] && U[lid].lvl >= 3 ? 13.8 : U[lid] && U[lid].lvl === 2 ? 11.6 : 6.6,
    trend: { vals: ser, lo, hi, u: k.u === '%' ? '%' : '', uEn: k.u === '%' ? '%' : '', kobj: k },
    rcAr: [`${nm(k)} في ${nm(U[uid])} عند ${dFmt(k, v)} مقابل مستهدف ${dFmt(k, t)} — فجوة ${NF(gapAbs, 1)}.`,
      drv.length ? `السبب الأرجح: ${nm(drv[0])} — ${drv[0].evTxt || ''}` : 'التفكيك المتاح يشير إلى تركّز الفجوة في نطاق فرعي واحد.',
      p0 ? `الطرف الأكثر مساهمة: ${nm(p0.pt)} بنسبة ${NF(p0.sh, 0)}٪ من الفجوة، وبتجاوز مستوى خدمة ${NF(p0.br, 0)}٪.` : '',
      'الشكاوى المرتبطة في النطاق نفسه ترتفع بالتوازي مع المؤشر، ما يرجّح أن الإشارة تشغيلية وليست إحصائية.'].filter(Boolean),
    rcEn: [`${nm(k)} in ${nm(U[uid])} is ${dFmt(k, v)} against a ${dFmt(k, t)} target — a gap of ${NF(gapAbs, 1)}.`,
      drv.length ? `Most likely cause: ${nm(drv[0])} — ${drv[0].evTxt || ''}` : 'The available decomposition points to the gap concentrating in a single sub-scope.',
      p0 ? `Largest contributing party: ${nm(p0.pt)} at ${NF(p0.sh, 0)}% of the gap, running ${NF(p0.br, 0)}% past SLA.` : '',
      'Related complaints in the same scope rise in step with the KPI, which suggests an operational signal rather than a statistical one.'].filter(Boolean),
    ctr: p0 ? { ar: nm(p0.pt), en: nm(p0.pt), id: p0.id, scAr: nm(U[lid]), scEn: nm(U[lid]) } : null,
    sla: p0 ? [{ ar: 'تجاوز مستوى الخدمة', en: 'Past SLA', v: Math.round(p0.br), t: 10, u: '%', dir: -1 },
      { ar: 'حالات مرتبطة', en: 'Linked cases', v: p0.n, t: Math.round(p0.n * .45), u: '', dir: -1 }] : [],
    viol: p0 ? [{ kind: 'in_v_warn', dAr: 'قبل ' + NF(20 + Math.round(r() * 70)) + ' يومًا',
        dEn: NF(20 + Math.round(r() * 70)) + ' days ago', st: 'in_v_paid', amt: null,
        rAr: 'تجاوز مستوى الخدمة المتعاقد عليه', rEn: 'Breach of the contracted service level' },
      { kind: 'in_v_fine', dAr: 'قبل ' + NF(8 + Math.round(r() * 24)) + ' يومًا',
        dEn: NF(8 + Math.round(r() * 24)) + ' days ago', st: 'in_v_open',
        amt: 5000 * (3 + Math.round(r() * 9)), rAr: 'تكرار المخالفة دون معالجة', rEn: 'Repeat breach with no remediation' }] : [],
    cx: { m: cx, catAr: ['بلاغات مرتبطة بالمؤشر', 'تكرار من نفس الموقع', 'بلاغات دون إغلاق', 'أخرى'],
      catEn: ['Reports linked to the KPI', 'Repeats from the same location', 'Reports not closed', 'Other'],
      cats: [38, 27, 21, 14] },
    hot: (() => {
      const kids = typeof kidsOf === 'function' ? kidsOf(lid) : [];
      if (kids.length) {
        return kids.map(cc => ({ ar: cc.ar, en: cc.en, ll: cc.c,
          n: Math.max(1, Math.round(attention(cc.id, g.dom) * 10)) }))
          .sort((a, b) => b.n - a.n).slice(0, 6);
      }
      return null;
    })(),
    rec: (() => {
      const out = drv.map(d => ({ ar: nm(d.act), en: nm(d.act),
        imp: d.up >= .3 ? 'in_hi' : 'in_mid', eff: d.eff === 'l' ? 'in_eff_l' : d.eff === 'h' ? 'in_eff_h' : 'in_eff_m',
        ownAr: nm(d.own || { ar: 'الأمانة', en: 'Amana' }), ownEn: nm(d.own || { ar: 'الأمانة', en: 'Amana' }) }));
      /* every contributing party carries what the city can require of it — use that */
      parties.forEach((pp, i) => out.push({ ar: pp.rAr, en: pp.rEn,
        imp: pp.sh >= 25 ? 'in_hi' : 'in_mid', eff: i === 0 ? 'in_eff_l' : 'in_eff_m',
        ownAr: nm(pp.pt), ownEn: nm(pp.pt) }));
      if (typeof actOf === 'function' && !out.length) {
        const A = actOf(lid, g.dom, g.kpi, 0);
        out.push({ ar: nm(A.act), en: nm(A.act), imp: 'in_mid', eff: 'in_eff_m',
          ownAr: nm(DOM[g.dom]), ownEn: nm(DOM[g.dom]) });
      }
      return out.slice(0, 4);
    })(),
    cta: [{ ar: 'إصدار أمر تصحيح ملزم', en: 'Issue a binding correction order', k: 'order' },
      { ar: 'إدراج المؤشر في المتابعة الأسبوعية', en: 'Add the KPI to weekly follow-up', k: 'watch' },
      { ar: 'حملة ميدانية في النطاق', en: 'Field campaign in this scope', k: 'campaign' }],
    wi: (() => {
      const up = drv.length ? drv.reduce((s, d) => s + d.up, 0) : .5;
      const closed = Math.min(gapAbs * clamp(up, .2, .9), gapAbs);
      const after = k.dir === 1 ? v + closed : v - closed;
      return [{ ar: nm(k), en: nm(k), b: v, a: after, u: '', uEn: '', dir: k.dir, kobj: k },
        { ar: 'شكاوى المواطنين شهريًا', en: 'Citizen complaints per month', b: cx[2], a: Math.round(cx[2] * .68), u: '', uEn: '', dir: -1 },
        { ar: 'الفجوة عن المستهدف', en: 'Gap to target', b: gapAbs, a: Math.max(0, gapAbs - closed), u: '', uEn: '', dir: -1 }];
    })(),
    wiAr: 'التقدير مبني على الأثر المعتاد لحزمة التوصيات في نطاقات مشابهة خلال ست أسابيع.',
    wiEn: 'The estimate is based on the usual effect of this recommendation package in comparable scopes over six weeks.',
  };
}
/* ---------- the list: authored first, then engine insights ---------- */
function insList(uid, dom) {
  const out = [];
  Object.keys(INSX).forEach(id => { const x = INSX[id];
    if ((!dom || dom === x.dom) && insInScope(x, uid)) out.push(x); });
  genInsights(uid, dom).forEach((g, i) => {
    out.push(Object.assign({}, g, { id: 'g_' + g.dom + '_' + g.kpi + '_' + i, gen: true }));
  });
  return out;
}
let INSCUR = null;
const INSCACHE = {};
function insDetail(x) {
  if (!x.gen) return x;
  const key = x.id + '|' + ((x.loc && x.loc.id) || HS.uid) + '|' + PER;
  if (!INSCACHE[key]) INSCACHE[key] = insDerive(x);
  return INSCACHE[key];                      /* cached so executed actions persist */
}

/* --- source lines 8559-8576 --- */
/* ---------- real-time feed ---------- */
const EV = [
  { t: 'cx', ic: '📣', sev: 'info', kpi: 'cx', ar: 'بلاغ جديد: {vp} — {loc}', en: 'New citizen report: {vp} — {loc}' },
  { t: 'cx', ic: '📣', sev: 'warn', kpi: 'cx', ar: 'بلاغ متكرر ({n} مرة) على نفس الموقع — {loc}', en: 'Repeat report ({n}×) at the same location — {loc}' },
  { t: 'insp', ic: '🔍', sev: 'info', kpi: 'cov', ar: 'زيارة تفتيشية مكتملة — {lic} — {loc}', en: 'Inspection completed — {lic} — {loc}' },
  { t: 'insp', ic: '🔍', sev: 'warn', kpi: 'cov', ar: '{n} موقعًا مستحقًا للتفتيش تجاوز مدة الجدولة — {loc}', en: '{n} sites overdue for inspection — {loc}' },
  { t: 'vio', ic: '⚠', sev: 'warn', kpi: 'comp', ar: 'رصد مخالفة {lic} — {loc}', en: 'Violation detected — {lic} — {loc}' },
  { t: 'vio', ic: '⛏', sev: 'crit', kpi: 'comp', ar: 'حفريات دون تصريح سارٍ — {loc} — إشعار الجهة الخدمية', en: 'Excavation without a valid permit — {loc} — utility notified' },
  { t: 'enf', ic: '⚖', sev: 'info', kpi: 'enf', ar: 'تنفيذ إنذار على منشأة {lic} — {loc}', en: 'Warning enforced on a {lic} establishment — {loc}' },
  { t: 'enf', ic: '💰', sev: 'info', kpi: 'enf', ar: 'إصدار غرامة بقيمة {sar} ريال — {loc}', en: 'Fine issued: SAR {sar} — {loc}' },
  { t: 'lic', ic: '📄', sev: 'info', kpi: 'ttl', ar: 'إصدار رخصة {lic} خلال {d} يوم — {loc}', en: '{lic} license issued in {d} days — {loc}' },
  { t: 'vp', ic: '👁', sev: 'info', kpi: 'vpenf', ar: 'إزالة عنصر تشوه بصري: {vp} — {loc}', en: 'Visual-pollution element removed: {vp} — {loc}' },
  { t: 'vp', ic: '🕒', sev: 'warn', kpi: 'vpenf', ar: 'عنصر تشوه بصري تجاوز مدة المعالجة: {vp} — {loc}', en: 'VP element past its resolution window: {vp} — {loc}' },
  { t: 'ai', ic: '✨', sev: 'crit', kpi: null, ar: 'تنبيه ذكي: ارتفاع بلاغات {vp} بنسبة {p}٪ خلال ٢٤ ساعة — {loc}', en: 'AI alert: {vp} reports up {p}% in 24h — {loc}' },
  { t: 'ai', ic: '✨', sev: 'warn', kpi: null, ar: 'تنبيه ذكي: تجمّع مخالفات {lic} في نطاق واحد — {loc}', en: 'AI alert: cluster of {lic} violations in one scope — {loc}' },
  { t: 'insp', ic: '🏛', sev: 'info', kpi: 'uin', ar: 'مراجعة هوية عمرانية لـ {n} رخصة بناء — {loc}', en: 'Urban-identity review on {n} building permits — {loc}' },
  { t: 'cx', ic: '😊', sev: 'info', kpi: 'sat', ar: 'تقييم مستفيد {n}/5 لخدمة {svc} — {loc}', en: 'Citizen rated {svc} {n}/5 — {loc}' },
];

/* --- bootstrap (called inline in the source document) --- */
buildVpDims();
buildUnits();

window.CV = {
  SEED, GEO_REGIONS, GEO_RIYADH, I18N, KPIS, K, DIMS, U, KSA, REGIONS, CITIES, DISTRICTS,
  MONTHS, MN_AR, MN_EN, mLabel, SHOCK,
  INC, TRENDS, trendSeries, SEVC, TYPEIC, SRCIC,
  DOMAINS, DOM, ACTLIB, genInsights, dVal, dT, dGap, dBand, dRatio, dFmt, dSeries,
  domScore, locContrib, popF,
  PTY, WHOMAP, WHODEF, whoFor,
  DRIVERS, driversFor,
  INSX, insList, insDetail, insDerive, insInScope,
  HOTT, STREETS, hotspots, hotById, hotCol, subDistricts, kidsOf, levelOf, DNAMES,
  MON, MONBY, EV,
  raw, leaf, series, at, dimVec, ratio, band, BANDC_L, BANDC_D, bcol, bandKey,
  fmtV, unitSuffix, gap, delta, childrenOf, scopeChildren, contrib, dimContrib,
  worstKpi, fastestFalling, project, delta3dim, cxCount, axOf, regionOf,
  h32, rng, jit, clamp, NF, PCT, T, nm, HS,
};
Object.defineProperty(window.CV, "PER",   { get: () => PER,   set: v => { PER = v; } });
Object.defineProperty(window.CV, "LANG",  { get: () => LANG,  set: v => { LANG = v; } });
Object.defineProperty(window.CV, "BANDC", { get: () => BANDC, set: v => { BANDC = v; } });
