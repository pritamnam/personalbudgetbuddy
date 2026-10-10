export const LANGUAGES = [
  { code: "en", label: "English", locale: "en-US" },
  { code: "mr", label: "मराठी", locale: "mr-IN" },
  { code: "hi", label: "हिन्दी", locale: "hi-IN" },
  { code: "ja", label: "日本語", locale: "ja-JP" },
] as const;
export type Language = (typeof LANGUAGES)[number]["code"];
export function isLanguage(value: unknown): value is Language {
  return LANGUAGES.some((language) => language.code === value);
}

// English source phrases are stable keys. Stored finance values and personal text never change.
const rows = `
Advisory|सल्ला|सलाह|アドバイス
Dashboard|आढावा|डैशबोर्ड|ダッシュボード
Expenses|खर्च|खर्च|支出
Budgets|अंदाजपत्रके|बजट|予算
Savings Goals|बचतीची उद्दिष्टे|बचत के लक्ष्य|貯蓄目標
Savings goals|बचतीची उद्दिष्टे|बचत के लक्ष्य|貯蓄目標
Analytics|विश्लेषण|विश्लेषण|分析
Reminders|स्मरणपत्रे|अनुस्मारक|リマインダー
Settings|सेटिंग्ज|सेटिंग्स|設定
Menu|मेनू|मेन्यू|メニュー
Log In|लॉग इन|लॉग इन|ログイン
Log in|लॉग इन|लॉग इन|ログイン
Sign out|लॉग आउट|लॉग आउट|ログアウト
Signing out…|लॉग आउट होत आहे…|लॉग आउट हो रहा है…|ログアウト中…
Finance sections|आर्थिक विभाग|वित्तीय अनुभाग|家計メニュー
Open navigation menu|नेव्हिगेशन मेनू उघडा|नेविगेशन मेन्यू खोलें|ナビゲーションメニューを開く
Current section|सध्याचा विभाग|वर्तमान अनुभाग|現在のページ
SpendSmart / Advisory|SpendSmart / सल्ला|SpendSmart / सलाह|SpendSmart / アドバイス
SpendSmart · Your money, your way|SpendSmart · तुमचा पैसा, तुमच्या पद्धतीने|SpendSmart · आपका पैसा, आपका तरीका|SpendSmart · お金の管理を、自分らしく
Money-saving advice|पैसे वाचवण्याचा सल्ला|पैसे बचाने की सलाह|節約のアドバイス
A little intention today. More freedom tomorrow. Build money habits that work for your everyday life.|आजचा छोटासा निश्चय, उद्याचे अधिक स्वातंत्र्य. रोजच्या जीवनाला अनुरूप आर्थिक सवयी लावा.|आज का छोटा संकल्प, कल की अधिक आज़ादी। रोज़मर्रा के जीवन के लिए अच्छी आर्थिक आदतें बनाएँ।|今日の小さな心がけが、明日の自由につながります。毎日の暮らしに合ったお金の習慣を育てましょう。
Small habits. Real progress.|छोट्या सवयी. खरी प्रगती.|छोटी आदतें। सच्ची प्रगति।|小さな習慣。確かな進歩。
Start with one change this week|या आठवड्यात एका बदलाने सुरुवात करा|इस हफ़्ते एक बदलाव से शुरुआत करें|今週はひとつの変化から
Give every expense a name|प्रत्येक खर्चाची नोंद करा|हर खर्च को एक नाम दें|すべての支出を記録する
Track the little purchases as well as the big ones. A weekly review can reveal one habit worth changing.|लहान आणि मोठ्या खरेदीची नोंद ठेवा. साप्ताहिक आढाव्यातून बदलण्यासारखी एखादी सवय समजू शकते.|छोटी और बड़ी, दोनों ख़रीदारियों का हिसाब रखें। साप्ताहिक समीक्षा से बदलने योग्य आदत सामने आ सकती है।|大きな買い物だけでなく、小さな支出も記録しましょう。週に一度の振り返りで、見直したい習慣が見つかります。
Review expenses|खर्चाचा आढावा घ्या|खर्च की समीक्षा करें|支出を確認
Plan before you spend|खर्च करण्यापूर्वी नियोजन करा|खर्च से पहले योजना बनाएँ|使う前に計画する
Set a realistic limit for each category. Leave room for essentials and a little enjoyment, not just restrictions.|प्रत्येक श्रेणीसाठी वास्तववादी मर्यादा ठरवा. आवश्यक गोष्टी आणि थोड्या आनंदासाठीही जागा ठेवा.|हर श्रेणी की व्यावहारिक सीमा तय करें। ज़रूरतों और थोड़ी ख़ुशी के लिए भी जगह रखें।|項目ごとに無理のない上限を決めましょう。制限だけでなく、必需品や楽しみのための余裕も大切です。
Plan your budget|अंदाजपत्रक तयार करा|अपना बजट बनाएँ|予算を立てる
Save a little, regularly|थोडी बचत, नियमितपणे|थोड़ी बचत, नियमित रूप से|少しずつ、定期的に貯める
Choose an amount you can comfortably set aside each payday. Consistency matters more than starting big.|प्रत्येक पगारातून सहज बाजूला ठेवता येईल अशी रक्कम निवडा. मोठ्या सुरुवातीपेक्षा सातत्य महत्त्वाचे.|हर वेतन से आसानी से बचाई जा सकने वाली राशि चुनें। बड़ी शुरुआत से ज़्यादा नियमितता मायने रखती है।|給料日ごとに無理なく貯められる金額を決めましょう。最初の金額より、続けることが大切です。
Set a savings goal|बचतीचे उद्दिष्ट ठरवा|बचत का लक्ष्य तय करें|貯蓄目標を設定
Pause the impulse purchase|अचानक होणाऱ्या खरेदीला थांबवा|अचानक ख़रीदारी करने से रुकें|衝動買いの前に一呼吸
Put non-essential purchases on a wish list and wait a day. Compare prices and decide whether you still need them.|अनावश्यक खरेदी इच्छायादीत ठेवा आणि एक दिवस थांबा. किंमती तुलना करून गरज ठरवा.|गैरज़रूरी चीज़ों को इच्छा-सूची में रखें और एक दिन रुकें। कीमतों की तुलना करके ज़रूरत तय करें।|必需品以外は欲しい物リストに入れて一日待ちましょう。価格を比べ、本当に必要か考えてみましょう。
Check your spending|तुमचा खर्च तपासा|अपना खर्च जाँचें|支出を見直す
Make room for surprises|अनपेक्षित खर्चासाठी तरतूद करा|अचानक खर्च के लिए तैयारी करें|もしもの出費に備える
Build a separate emergency fund at your own pace. Even a small cushion can make an unexpected bill easier to handle.|तुमच्या गतीने स्वतंत्र आपत्कालीन निधी तयार करा. छोटी बचतही अचानक आलेल्या बिलासाठी मदत करते.|अपनी गति से अलग आपातकालीन निधि बनाएँ। थोड़ी बचत भी अचानक आए बिल को संभालने में मदद करती है।|自分のペースで緊急用の貯蓄を作りましょう。少しの備えでも、突然の請求に対応しやすくなります。
Build your cushion|आपत्कालीन बचत करा|आपातकालीन बचत बनाएँ|備えを作る
Check what renews|नूतनीकरण होणाऱ्या सेवांचा आढावा घ्या|नवीनीकरण होने वाली सेवाएँ जाँचें|更新される契約を確認
Review subscriptions and note upcoming bills. Cancel what you no longer use before the next renewal.|सदस्यत्वांचा आढावा घ्या आणि आगामी बिले नोंदवा. न वापरणाऱ्या सेवा पुढच्या नूतनीकरणापूर्वी बंद करा.|सदस्यताओं की समीक्षा करें और आने वाले बिल लिखें। अगली अवधि से पहले अनुपयोगी सेवाएँ बंद करें।|定期購入や今後の請求を確認しましょう。使っていないサービスは次の更新前に解約しましょう。
Plan a reminder|स्मरणपत्र ठरवा|अनुस्मारक बनाएँ|リマインダーを設定
Coins in a savings jar beside a growing plant and notebook|रोप आणि वहीजवळ बचतीच्या बरणीत नाणी|पौधे और नोटबुक के पास बचत के जार में सिक्के|植物とノートの隣にある貯金瓶の硬貨
Every small step counts.|प्रत्येक छोटी पायरी महत्त्वाची.|हर छोटा कदम मायने रखता है।|小さな一歩にも価値がある。
“You don’t have to change your whole financial life today. Just make one choice your future self will thank you for.”|“आजच संपूर्ण आर्थिक जीवन बदलण्याची गरज नाही. भविष्यातील तुम्हाला आनंद देईल अशी एक निवड करा.”|“आज ही पूरा आर्थिक जीवन बदलना ज़रूरी नहीं। बस एक ऐसा निर्णय लें जिसके लिए भविष्य में आप ख़ुद को धन्यवाद देंगे।”|「今日、家計のすべてを変える必要はありません。未来の自分が感謝する選択をひとつしてみましょう。」
A SpendSmart reminder|SpendSmart ची आठवण|SpendSmart की याद दिलाती बात|SpendSmartからのメッセージ
More encouragement|आणखी प्रेरणा|और प्रेरणा|さらなる励まし
SpendSmart encouragement|SpendSmart प्रेरणा|SpendSmart की प्रेरणा|SpendSmartからの励まし
Progress is not the size of your first deposit. It’s the habit of showing up again.|प्रगती पहिल्या ठेवीच्या रकमेवर नाही, तर पुन्हा बचत करण्याच्या सवयीवर अवलंबून असते.|प्रगति पहली जमा राशि से नहीं, बार-बार बचत करने की आदत से होती है।|進歩は最初の貯金額ではなく、繰り返し続ける習慣から生まれます。
A budget is not a limit on your life. It’s a plan for what matters to you.|अंदाजपत्रक म्हणजे जीवनावर मर्यादा नाही. तुमच्यासाठी महत्त्वाच्या गोष्टींची योजना आहे.|बजट जीवन की सीमा नहीं, आपके लिए अहम चीज़ों की योजना है।|予算は暮らしを制限するものではなく、大切なことのための計画です。
General guidance for everyday money habits, not personalized financial advice.|रोजच्या आर्थिक सवयींसाठी सामान्य मार्गदर्शन; वैयक्तिक आर्थिक सल्ला नाही.|रोज़मर्रा की आर्थिक आदतों के लिए सामान्य मार्गदर्शन, व्यक्तिगत वित्तीय सलाह नहीं।|日々のお金の習慣についての一般的な情報であり、個別の金融助言ではありません。
Make it yours|तुमच्या आवडीनुसार|अपनी पसंद के अनुसार|自分に合わせて
Your preferences, remembered on this device.|तुमची प्राधान्ये या उपकरणावर जतन केली जातील.|आपकी प्राथमिकताएँ इस डिवाइस पर याद रखी जाएँगी।|設定はこの端末に保存されます。
Language|भाषा|भाषा|言語
Preferred language|पसंतीची भाषा|पसंदीदा भाषा|表示言語
Currency|चलन|मुद्रा|通貨
Preferred currency|पसंतीचे चलन|पसंदीदा मुद्रा|表示通貨
A consistent currency for expenses, budgets and savings.|खर्च, अंदाजपत्रके आणि बचतीसाठी एकच चलन.|खर्च, बजट और बचत के लिए एक समान मुद्रा।|支出、予算、貯蓄を同じ通貨で表示。
Appearance|दिसणे|दिखावट|外観
Light, dark, or matched to your device.|हलकी, गडद किंवा तुमच्या उपकरणानुसार.|हल्का, गहरा या डिवाइस के अनुसार।|ライト、ダーク、または端末に合わせる。
Theme|थीम|थीम|テーマ
Light|हलकी|हल्का|ライト
Dark|गडद|गहरा|ダーク
System|उपकरणानुसार|सिस्टम|システム
Notifications|सूचना|सूचनाएँ|通知
Due reminder alerts|देय स्मरणपत्र सूचना|देय अनुस्मारक सूचनाएँ|期限のリマインダー通知
Show due and overdue reminders while you’re using SpendSmart. No emails or background notifications.|SpendSmart वापरताना देय आणि थकीत स्मरणपत्रे दाखवा. ईमेल किंवा पार्श्वभूमीतील सूचना नाहीत.|SpendSmart इस्तेमाल करते समय देय और बकाया अनुस्मारक दिखाएँ। ईमेल या पृष्ठभूमि सूचनाएँ नहीं।|SpendSmartの使用中に、期限が来たリマインダーを表示します。メールやバックグラウンド通知はありません。
Your money, this month|या महिन्यात तुमचा पैसा|इस महीने आपका पैसा|今月の家計
A live view of spending, budgets, savings and the bills waiting on you.|खर्च, अंदाजपत्रके, बचत आणि आगामी बिलांचा ताजा आढावा.|खर्च, बजट, बचत और आने वाले बिलों की ताज़ा झलक।|支出、予算、貯蓄、今後の請求をまとめて確認。
Using SpendSmart as a guest — create an account to avoid losing records.|तुम्ही SpendSmart पाहुणे म्हणून वापरत आहात — नोंदी जतन करण्यासाठी खाते तयार करा.|आप SpendSmart अतिथि के रूप में इस्तेमाल कर रहे हैं — रिकॉर्ड बचाने के लिए खाता बनाएँ।|ゲストとして利用中です。記録を保存するにはアカウントを作成してください。
Spent this month|या महिन्याचा खर्च|इस महीने का खर्च|今月の支出
Budget left|उरलेले अंदाजपत्रक|बचा बजट|予算残額
Saved so far|आतापर्यंतची बचत|अब तक की बचत|現在の貯蓄
Open reminders|अपूर्ण स्मरणपत्रे|अधूरे अनुस्मारक|未完了のリマインダー
bills & money tasks|बिले आणि आर्थिक कामे|बिल और आर्थिक काम|請求と家計のタスク
Spending by category|श्रेणीनुसार खर्च|श्रेणी के अनुसार खर्च|項目別の支出
Budget vs spend|अंदाजपत्रक आणि खर्च|बजट और खर्च|予算と支出の比較
Six-month spending trend|सहा महिन्यांचा खर्चाचा कल|छह महीने के खर्च का रुझान|6か月の支出推移
Manage|व्यवस्थापित करा|प्रबंधन करें|管理
No goals yet.|अद्याप उद्दिष्टे नाहीत.|अभी कोई लक्ष्य नहीं।|目標はまだありません。
Upcoming reminders|आगामी स्मरणपत्रे|आगामी अनुस्मारक|今後のリマインダー
Open list|यादी उघडा|सूची खोलें|一覧を開く
All caught up.|सर्व पूर्ण झाले.|सब पूरा हो गया।|すべて完了しました。
Log what you spend and keep every category honest.|खर्चाची नोंद करा आणि प्रत्येक श्रेणीचा हिशोब ठेवा.|खर्च दर्ज करें और हर श्रेणी का सही हिसाब रखें।|支出を記録し、項目ごとの使い方を把握しましょう。
Edit expense|खर्च संपादित करा|खर्च संपादित करें|支出を編集
Add an expense|खर्च जोडा|खर्च जोड़ें|支出を追加
Add expense|खर्च जोडा|खर्च जोड़ें|支出を追加
What did you buy?|काय खरेदी केले?|क्या ख़रीदा?|何を購入しましたか？
Amount|रक्कम|राशि|金額
Save changes|बदल जतन करा|बदलाव सहेजें|変更を保存
Cancel|रद्द करा|रद्द करें|キャンセル
All categories|सर्व श्रेणी|सभी श्रेणियाँ|すべての項目
No expenses yet. Add your first one above.|अद्याप खर्च नाही. वर पहिला खर्च जोडा.|अभी कोई खर्च नहीं। ऊपर पहला खर्च जोड़ें।|支出はまだありません。上から最初の支出を追加してください。
Edit|संपादित करा|संपादित करें|編集
Delete|हटवा|हटाएँ|削除
Budget planning|अंदाजपत्रक नियोजन|बजट योजना|予算計画
Set a monthly ceiling per category. Bars turn amber near the limit and red once you pass it.|प्रत्येक श्रेणीसाठी मासिक मर्यादा ठरवा. मर्यादेजवळ पट्टी पिवळी आणि मर्यादा ओलांडल्यावर लाल होते.|हर श्रेणी की मासिक सीमा तय करें। सीमा के पास पट्टी पीली और पार होने पर लाल हो जाती है।|項目ごとの月間上限を設定しましょう。上限に近づくと黄色、超えると赤色になります。
Monthly budget|मासिक अंदाजपत्रक|मासिक बजट|月間予算
Remaining|शिल्लक|शेष|残額
Monthly limit|मासिक मर्यादा|मासिक सीमा|月間上限
Name the thing you are saving for, then chip away at it.|कशासाठी बचत करत आहात ते ठरवा आणि हळूहळू पुढे जा.|बचत का उद्देश्य तय करें और धीरे-धीरे आगे बढ़ें।|何のために貯めるかを決め、少しずつ近づきましょう。
New goal|नवे उद्दिष्ट|नया लक्ष्य|新しい目標
Goal name|उद्दिष्टाचे नाव|लक्ष्य का नाम|目標名
Target|लक्ष्य रक्कम|लक्ष्य राशि|目標金額
Already saved|आधीच केलेली बचत|पहले से बचाई राशि|現在の貯蓄額
Add goal|उद्दिष्ट जोडा|लक्ष्य जोड़ें|目標を追加
No savings goals yet.|अद्याप बचतीची उद्दिष्टे नाहीत.|अभी बचत के लक्ष्य नहीं हैं।|貯蓄目標はまだありません。
Goal reached — time to celebrate!|उद्दिष्ट गाठले — साजरे करण्याची वेळ!|लक्ष्य पूरा — जश्न मनाने का समय!|目標達成！お祝いしましょう！
Almost there. Keep the streak alive.|जवळजवळ पोहोचलात. सातत्य ठेवा.|लगभग पहुँच गए। नियमितता बनाए रखें।|あと少しです。この調子で続けましょう。
Solid momentum, over a third of the way.|चांगली प्रगती, एक तृतीयांशापेक्षा अधिक पूर्ण.|अच्छी प्रगति, एक तिहाई से ज़्यादा पूरा।|順調です。3分の1以上進みました。
Good start — small deposits add up.|चांगली सुरुवात — छोट्या ठेवी वाढत जातात.|अच्छी शुरुआत — छोटी बचत जुड़ती जाती है।|いいスタートです。小さな貯金が積み重なります。
Add your first deposit to get moving.|सुरुवातीसाठी पहिली ठेव जोडा.|शुरू करने के लिए पहली राशि जमा करें।|最初の貯金を追加して始めましょう。
Financial analytics|आर्थिक विश्लेषण|वित्तीय विश्लेषण|家計分析
Compare this month’s spending, category mix and six-month trend.|या महिन्याचा खर्च, श्रेणींचे प्रमाण आणि सहा महिन्यांचा कल तुलना करा.|इस महीने के खर्च, श्रेणियों के अनुपात और छह महीने के रुझान की तुलना करें।|今月の支出、項目の割合、6か月の推移を比較しましょう。
Monthly spend|मासिक खर्च|मासिक खर्च|月間支出
Average expense|सरासरी खर्च|औसत खर्च|平均支出
Budget usage|अंदाजपत्रकाचा वापर|बजट का उपयोग|予算使用率
Top category|सर्वाधिक खर्चाची श्रेणी|सबसे अधिक खर्च की श्रेणी|最大の支出項目
No spending yet|अद्याप खर्च नाही|अभी खर्च नहीं|支出はまだありません
Financial reminders|आर्थिक स्मरणपत्रे|वित्तीय अनुस्मारक|家計リマインダー
Bill payments, transfers, renewals — keep them off your mind and on the list.|बिले, हस्तांतरणे, नूतनीकरणे — लक्षात ठेवण्याऐवजी यादीत नोंदवा.|बिल, हस्तांतरण, नवीनीकरण — मन में रखने के बजाय सूची में लिखें।|請求、振込、更新をリストにまとめて、忘れる心配を減らしましょう。
e.g. Pay electricity bill|उदा. वीजबिल भरा|जैसे बिजली का बिल भरें|例：電気代を払う
Add task|काम जोडा|काम जोड़ें|タスクを追加
Open|अपूर्ण|अधूरे|未完了
Nothing pending. Nice.|काहीही बाकी नाही. छान.|कुछ भी बाकी नहीं। बढ़िया।|未完了はありません。すばらしい！
Due|देय तारीख|देय तिथि|期限
Completed|पूर्ण|पूरे हुए|完了
Overdue|थकीत|बकाया|期限超過
Spent|खर्च|खर्च|支出
Budget|अंदाजपत्रक|बजट|予算
Food|अन्न|भोजन|食費
Transport|प्रवास|परिवहन|交通費
Travel|प्रवास|यात्रा|旅行・交通費
Bills|बिले|बिल|請求・固定費
Housing|निवास|आवास|住居費
Utilities|मूलभूत सेवा|उपयोगिताएँ|光熱費
Shopping|खरेदी|ख़रीदारी|買い物
Health|आरोग्य|स्वास्थ्य|医療・健康
Entertainment|मनोरंजन|मनोरंजन|娯楽
Education|शिक्षण|शिक्षा|教育
Other|इतर|अन्य|その他
Log in to SpendSmart|SpendSmart मध्ये लॉग इन करा|SpendSmart में लॉग इन करें|SpendSmartにログイン
Your saved finances are waiting for you.|तुमच्या जतन केलेल्या आर्थिक नोंदी तयार आहेत.|आपके सहेजे गए आर्थिक रिकॉर्ड तैयार हैं।|保存した家計の記録にアクセスできます。
Create your account|तुमचे खाते तयार करा|अपना खाता बनाएँ|アカウントを作成
Keep your finances across visits and devices.|तुमच्या आर्थिक नोंदी वेगवेगळ्या उपकरणांवर जतन करा.|अपने आर्थिक रिकॉर्ड अलग-अलग डिवाइस पर सहेजें।|端末を変えても家計の記録を保存できます。
Reset your password|पासवर्ड पुन्हा ठरवा|पासवर्ड रीसेट करें|パスワードを再設定
Enter your account email and we'll send you a verification code.|खात्याचा ईमेल द्या; आम्ही पडताळणी कोड पाठवू.|खाते का ईमेल दें; हम सत्यापन कोड भेजेंगे।|アカウントのメールアドレスに確認コードを送信します。
Enter verification code|पडताळणी कोड द्या|सत्यापन कोड दें|確認コードを入力
Check your inbox for the code, then choose a new password.|ईमेलमधील कोड तपासा, नंतर नवा पासवर्ड निवडा.|ईमेल में कोड देखें, फिर नया पासवर्ड चुनें।|メールのコードを確認し、新しいパスワードを選んでください。
Name|नाव|नाम|名前
Your name|तुमचे नाव|आपका नाम|お名前
Email|ईमेल|ईमेल|メールアドレス
Password|पासवर्ड|पासवर्ड|パスワード
Forgot password?|पासवर्ड विसरलात?|पासवर्ड भूल गए?|パスワードを忘れた方
At least 6 characters|किमान ६ अक्षरे|कम से कम 6 अक्षर|6文字以上
Verification code|पडताळणी कोड|सत्यापन कोड|確認コード
New password|नवा पासवर्ड|नया पासवर्ड|新しいパスワード
New to SpendSmart?|SpendSmart वर नवीन आहात?|SpendSmart पर नए हैं?|SpendSmartは初めてですか？
Sign up here|येथे नोंदणी करा|यहाँ पंजीकरण करें|新規登録
Already have an account?|आधीच खाते आहे?|पहले से खाता है?|アカウントをお持ちですか？
Remembered it?|आठवला का?|याद आ गया?|思い出しましたか？
Back to Log In|लॉग इनकडे परत|लॉग इन पर वापस|ログインに戻る
Create account|खाते तयार करा|खाता बनाएँ|アカウントを作成
Send verification code|पडताळणी कोड पाठवा|सत्यापन कोड भेजें|確認コードを送信
Verify & set new password|पडताळा आणि नवा पासवर्ड ठरवा|सत्यापित करें और नया पासवर्ड बनाएँ|確認してパスワードを設定
Please wait…|कृपया थांबा…|कृपया प्रतीक्षा करें…|お待ちください…
Resend code|कोड पुन्हा पाठवा|कोड फिर भेजें|コードを再送
Please enter your email.|कृपया तुमचा ईमेल द्या.|कृपया अपना ईमेल दें।|メールアドレスを入力してください。
Please enter the code from your email.|कृपया ईमेलमधील कोड द्या.|कृपया ईमेल का कोड दें।|メールのコードを入力してください。
New password must be at least 6 characters.|नवा पासवर्ड किमान ६ अक्षरांचा हवा.|नया पासवर्ड कम से कम 6 अक्षर का होना चाहिए।|新しいパスワードは6文字以上にしてください。
Password must be at least 6 characters.|पासवर्ड किमान ६ अक्षरांचा हवा.|पासवर्ड कम से कम 6 अक्षर का होना चाहिए।|パスワードは6文字以上にしてください。
That code is invalid or has expired. Request a new one and try again.|कोड चुकीचा किंवा कालबाह्य आहे. नवा कोड मागवून पुन्हा प्रयत्न करा.|कोड गलत है या समाप्त हो गया। नया कोड माँगकर फिर कोशिश करें।|コードが無効か期限切れです。新しいコードをリクエストしてください。
A new code is on its way.|नवा कोड पाठवला जात आहे.|नया कोड भेजा जा रहा है।|新しいコードを送信しました。
Couldn't send the code. Please try again.|कोड पाठवता आला नाही. पुन्हा प्रयत्न करा.|कोड नहीं भेज सके। फिर कोशिश करें।|コードを送信できませんでした。もう一度お試しください。
Please enter your email and password.|कृपया ईमेल आणि पासवर्ड द्या.|कृपया ईमेल और पासवर्ड दें।|メールアドレスとパスワードを入力してください。
Almost there — check your inbox and confirm your email, then log in.|जवळजवळ झाले — ईमेल तपासून पत्ता पुष्टी करा, नंतर लॉग इन करा.|लगभग हो गया — ईमेल जाँचकर पुष्टि करें, फिर लॉग इन करें।|メールでアドレスを確認してからログインしてください。
We couldn't reach the server. Please try again.|सर्व्हरशी संपर्क झाला नाही. पुन्हा प्रयत्न करा.|सर्वर से संपर्क नहीं हो सका। फिर कोशिश करें।|サーバーに接続できませんでした。もう一度お試しください。
Invalid email or password. Please try again.|ईमेल किंवा पासवर्ड चुकीचा आहे. पुन्हा प्रयत्न करा.|ईमेल या पासवर्ड गलत है। फिर कोशिश करें।|メールアドレスかパスワードが正しくありません。
Please confirm your email first, then log in.|आधी ईमेल पुष्टी करा, नंतर लॉग इन करा.|पहले ईमेल की पुष्टि करें, फिर लॉग इन करें।|メールアドレスを確認してからログインしてください。
An account with this email already exists. Try logging in.|या ईमेलचे खाते आहे. लॉग इन करून पहा.|इस ईमेल का खाता पहले से है। लॉग इन करें।|このメールのアカウントは既にあります。ログインしてください。
Too many attempts. Please wait a moment and try again.|खूप प्रयत्न झाले. थोडे थांबून पुन्हा प्रयत्न करा.|बहुत प्रयास हुए। थोड़ा रुककर फिर कोशिश करें।|試行回数が多すぎます。しばらく待って再試行してください。
Page not found|पृष्ठ सापडले नाही|पेज नहीं मिला|ページが見つかりません
The page you're looking for doesn't exist or has been moved.|हे पृष्ठ अस्तित्वात नाही किंवा हलवले आहे.|यह पेज मौजूद नहीं है या स्थान बदल गया है।|お探しのページは存在しないか移動しました。
Go home|मुख्य पृष्ठावर जा|होम पर जाएँ|ホームへ
This page didn't load|हे पृष्ठ उघडले नाही|यह पेज नहीं खुला|ページを読み込めませんでした
Something went wrong on our end. You can try refreshing or head back home.|काहीतरी चूक झाली. पुन्हा लोड करा किंवा मुख्य पृष्ठावर जा.|कुछ गड़बड़ हुई। रीफ़्रेश करें या होम पर जाएँ।|問題が発生しました。再読み込みするかホームに戻ってください。
Try again|पुन्हा प्रयत्न करा|फिर कोशिश करें|再試行
Loading live exchange rates…|विनिमय दर मिळवत आहे…|विनिमय दर लोड हो रहे हैं…|最新の為替レートを取得中…
Live exchange rates|ताजे विनिमय दर|ताज़ा विनिमय दर|最新の為替レート
Offline — using approximate rates|ऑफलाइन — अंदाजे दर वापरत आहे|ऑफ़लाइन — अनुमानित दर इस्तेमाल हो रहे हैं|オフライン — 概算レートを使用
Close|बंद करा|बंद करें|閉じる
`;
export const translations: Record<string, Record<Exclude<Language, "en">, string>> = Object.fromEntries(
  rows.trim().split("\n").map((row) => {
    const [key = "", mr = "", hi = "", ja = ""] = row.split("|");
    return [key, { mr, hi, ja }];
  }),
);
const messages = {
  entries: ["{count} entries", "{count} नोंदी", "{count} प्रविष्टियाँ", "{count}件"],
  usage: ["{percent}% of {amount} used", "{amount} पैकी {percent}% वापरले", "{amount} का {percent}% उपयोग", "{amount}の{percent}%を使用"],
  progress: ["{saved} of {target}", "{target} पैकी {saved}", "{target} में से {saved}", "{target}のうち{saved}"],
  goalTotal: ["of {amount} in goals", "उद्दिष्टांमध्ये {amount} पैकी", "लक्ष्यों में {amount} में से", "目標合計{amount}"],
  deadline: ["by {date}", "{date} पर्यंत", "{date} तक", "{date}まで"],
  dueReminders: ["{count} reminders are due or overdue.", "{count} स्मरणपत्रे देय किंवा थकीत आहेत.", "{count} अनुस्मारक देय या बकाया हैं।", "{count}件のリマインダーが期限を迎えています。"],
  codeSent: ["We sent a verification code to {email}.", "{email} वर पडताळणी कोड पाठवला.", "{email} पर सत्यापन कोड भेजा।", "{email}に確認コードを送信しました。"],
  resendIn: ["Resend code in {seconds}s", "{seconds} सेकंदांनंतर कोड पुन्हा पाठवा", "{seconds} सेकंड में कोड फिर भेजें", "{seconds}秒後に再送できます"],
} as const;
export function translate(language: Language, key: string): string {
  return language === "en" ? key : translations[key]?.[language] ?? key;
}
export function message(language: Language, key: keyof typeof messages, values: Record<string, string | number>): string {
  const index = LANGUAGES.findIndex((item) => item.code === language);
  return (messages[key][index] ?? messages[key][0]).replace(/\{(\w+)\}/g, (match, name: string) => String(values[name] ?? match));
}
