/* ════════════════════════════════════
   PERSONS
════════════════════════════════════ */
const PERSONS = {
  gyaan: {
    label:'Gyaan', emoji:'💪',
    proMin:100, proMax:120, calMin:1200, calMax:1300,
    pFactor:1.0, cFactor:1.0,
    snack:{ emoji:'🥛', label:'Afternoon Whey Shake', desc:'Required daily — bridges the gap to 100g+ protein', pro:25, cal:150 },
    note:'+whey daily · full portions'
  },
  mehak: {
    label:'Mehak', emoji:'🌸',
    proMin:70, proMax:90, calMin:1200, calMax:1300,
    pFactor:0.78, cFactor:0.90,
    snack:{ emoji:'🥚', label:'Midday Curd + 1 Boiled Egg', desc:'Optional — adds ~13g on high-activity days', pro:13, cal:130 },
    note:'~80% protein portions · no whey needed'
  }
};

/* ════════════════════════════════════
   MEAL DATA
════════════════════════════════════ */
function o(n,p,c){ return {n,p,c}; }
function m(title,ic,time,o1,o2){ return {title,ic,time,opts:[o1,o2]}; }
function d(name,note,...meals){ return {name,note,meals}; }

const PLAN = {
  week1:{
    desc:'Baseline week · very simple, mostly assemble-fast options',
    days:[
      d('Monday','Easy start',
        m('Breakfast','🌅','7–8 AM', o('2 Eggs + Toast',18,300), o('Whey + Banana',25,220)),
        m('Lunch','☀️','12–1 PM', o('Paneer Sandwich + Cucumber',20,420), o('Boiled Egg Sandwich',22,380)),
        m('Dinner','🌙','7–8 PM', o('Dal + Rice',15,350), o('Chicken Stir Fry + Roti',30,420))
      ),
      d('Tuesday','Light office lunch',
        m('Breakfast','🌅','7–8 AM', o('Poha + Curd',12,350), o('PB Toast',12,330)),
        m('Lunch','☀️','12–1 PM', o('Chickpea Salad + Bread',17,390), o('Chicken Rice Bowl',30,460)),
        m('Dinner','🌙','7–8 PM', o('Egg Bhurji + Roti',24,400), o('Paneer Stir Fry',22,360))
      ),
      d('Wednesday','Protein steady',
        m('Breakfast','🌅','7–8 AM', o('Omelette + Toast',20,320), o('Smoothie: Milk + Banana + PB',15,360)),
        m('Lunch','☀️','12–1 PM', o('Sprouts Chaat + Roti',15,360), o('Paneer Roll',20,430)),
        m('Dinner','🌙','7–8 PM', o('Dal + Roti',15,320), o('Chicken + Salad',30,360))
      ),
      d('Thursday','Low complexity',
        m('Breakfast','🌅','7–8 AM', o('Upma + Curd',12,350), o('Whey + Milk',28,260)),
        m('Lunch','☀️','12–1 PM', o('Egg Sandwich',22,380), o('Paneer + Rice + Salad',22,460)),
        m('Dinner','🌙','7–8 PM', o('Paneer Bhurji + Roti',24,420), o('Dal + Rice',15,350))
      ),
      d('Friday','Chicken day',
        m('Breakfast','🌅','7–8 AM', o('Eggs + Banana',18,290), o('Whey Shake',25,150)),
        m('Lunch','☀️','12–1 PM', o('Chicken + Roti + Salad',30,450), o('Chickpea Salad + Toast',17,390)),
        m('Dinner','🌙','7–8 PM', o('Egg Bhurji Bowl',24,350), o('Paneer Stir Fry + Salad',24,380))
      ),
      d('Saturday','Flexible',
        m('Breakfast','🌅','7–8 AM', o('Whey + Banana',25,220), o('Poha',8,300)),
        m('Lunch','☀️','12–1 PM', o('Paneer Rice Bowl',22,460), o('Chicken Sandwich',28,420)),
        m('Dinner','🌙','7–8 PM', o('Dal + Rice',15,350), o('Chicken Stir Fry',30,380))
      ),
      d('Sunday','Reset + prep',
        m('Breakfast','🌅','7–8 AM', o('Omelette + Toast',20,320), o('Fruit + Curd + Seeds',14,300)),
        m('Lunch','☀️','12–1 PM', o('Egg Roll',22,420), o('Paneer Sandwich',20,420)),
        m('Dinner','🌙','7–8 PM', o('Light Dal + Rice',15,320), o('Leftover Wrap',20,360))
      )
    ]
  },
  week2:{
    desc:'Sandwich, wrap & salad variation to avoid monotony',
    days:[
      d('Monday','Sandwich rotation',
        m('Breakfast','🌅','7–8 AM', o('Whey + Banana',25,220), o('Veg Omelette + Toast',20,330)),
        m('Lunch','☀️','12–1 PM', o('Paneer Tikka Sandwich',22,430), o('Egg Mayo Light Sandwich',22,400)),
        m('Dinner','🌙','7–8 PM', o('Dal + Rice',15,350), o('Chicken + Roti',30,430))
      ),
      d('Tuesday','Salad rotation',
        m('Breakfast','🌅','7–8 AM', o('Poha + Curd',12,350), o('PB Banana Toast',12,380)),
        m('Lunch','☀️','12–1 PM', o('Chickpea Chaat Salad',17,360), o('Chicken Salad + Bread',30,410)),
        m('Dinner','🌙','7–8 PM', o('Paneer Bhurji + Roti',24,420), o('Egg Bhurji + Toast',24,380))
      ),
      d('Wednesday','Quick prep',
        m('Breakfast','🌅','7–8 AM', o('Whey + Milk',28,260), o('Boiled Eggs + Toast',18,300)),
        m('Lunch','☀️','12–1 PM', o('Sprouts Chaat + Bread',15,360), o('Paneer Roll',20,430)),
        m('Dinner','🌙','7–8 PM', o('Dal + Roti',15,320), o('Chicken Stir Fry + Salad',30,380))
      ),
      d('Thursday','Simple Indian',
        m('Breakfast','🌅','7–8 AM', o('Upma + Curd',12,350), o('Smoothie',15,360)),
        m('Lunch','☀️','12–1 PM', o('Egg Sandwich',22,380), o('Paneer + Roti + Salad',22,450)),
        m('Dinner','🌙','7–8 PM', o('Dal + Rice',15,350), o('Paneer Stir Fry',22,360))
      ),
      d('Friday','Protein focus',
        m('Breakfast','🌅','7–8 AM', o('Omelette + Toast',20,320), o('Whey Shake',25,150)),
        m('Lunch','☀️','12–1 PM', o('Chicken Rice Bowl',30,460), o('Boiled Egg Salad + Toast',22,370)),
        m('Dinner','🌙','7–8 PM', o('Egg Bhurji + Roti',24,400), o('Chicken + Salad',30,360))
      ),
      d('Saturday','Flexible',
        m('Breakfast','🌅','7–8 AM', o('PB Toast',12,330), o('Whey + Banana',25,220)),
        m('Lunch','☀️','12–1 PM', o('Paneer Sandwich',20,420), o('Chicken Wrap',30,450)),
        m('Dinner','🌙','7–8 PM', o('Dal + Rice',15,350), o('Paneer Bhurji',24,360))
      ),
      d('Sunday','Prep day',
        m('Breakfast','🌅','7–8 AM', o('Eggs + Toast',18,300), o('Fruit + Curd',12,280)),
        m('Lunch','☀️','12–1 PM', o('Chickpea Salad + Bread',17,390), o('Paneer Roll',20,430)),
        m('Dinner','🌙','7–8 PM', o('Light Dal + Rice',15,320), o('Leftover Wrap',20,360))
      )
    ]
  },
  week3:{
    desc:'Higher protein rotation — chicken, eggs, paneer, dal, whey',
    days:[
      d('Monday','High protein start',
        m('Breakfast','🌅','7–8 AM', o('Whey + Banana',25,220), o('Omelette + Toast',20,320)),
        m('Lunch','☀️','12–1 PM', o('Chicken Sandwich',28,420), o('Paneer + Roti + Salad',22,450)),
        m('Dinner','🌙','7–8 PM', o('Dal + Rice',15,350), o('Egg Bhurji + Roti',24,400))
      ),
      d('Tuesday','Vegetarian easy',
        m('Breakfast','🌅','7–8 AM', o('Poha + Curd',12,350), o('PB Toast',12,330)),
        m('Lunch','☀️','12–1 PM', o('Chickpea Salad + Toast',17,390), o('Sprouts Chaat + Roti',15,360)),
        m('Dinner','🌙','7–8 PM', o('Paneer Stir Fry',22,360), o('Dal + Roti',15,320))
      ),
      d('Wednesday','Chicken day',
        m('Breakfast','🌅','7–8 AM', o('Whey + Milk',28,260), o('Eggs + Banana',18,290)),
        m('Lunch','☀️','12–1 PM', o('Chicken Rice Bowl',30,460), o('Egg Sandwich',22,380)),
        m('Dinner','🌙','7–8 PM', o('Chicken Stir Fry + Salad',30,380), o('Paneer Bhurji + Roti',24,420))
      ),
      d('Thursday','Low effort',
        m('Breakfast','🌅','7–8 AM', o('Upma + Curd',12,350), o('Smoothie',15,360)),
        m('Lunch','☀️','12–1 PM', o('Paneer Sandwich',20,420), o('Boiled Egg Salad + Bread',22,370)),
        m('Dinner','🌙','7–8 PM', o('Dal + Rice',15,350), o('Egg Bhurji',24,350))
      ),
      d('Friday','Balanced',
        m('Breakfast','🌅','7–8 AM', o('Omelette + Toast',20,320), o('Whey Shake',25,150)),
        m('Lunch','☀️','12–1 PM', o('Chicken + Roti + Salad',30,450), o('Chickpea Chaat Salad',17,360)),
        m('Dinner','🌙','7–8 PM', o('Paneer Stir Fry + Salad',24,380), o('Dal + Roti',15,320))
      ),
      d('Saturday','Fun simple',
        m('Breakfast','🌅','7–8 AM', o('PB Banana Toast',12,380), o('Whey + Banana',25,220)),
        m('Lunch','☀️','12–1 PM', o('Chicken Wrap',30,450), o('Paneer Roll',20,430)),
        m('Dinner','🌙','7–8 PM', o('Dal + Rice',15,350), o('Egg Bhurji + Toast',24,380))
      ),
      d('Sunday','Reset',
        m('Breakfast','🌅','7–8 AM', o('Fruit + Curd + Seeds',14,300), o('Eggs + Toast',18,300)),
        m('Lunch','☀️','12–1 PM', o('Sprouts Chaat + Bread',15,360), o('Paneer Sandwich',20,420)),
        m('Dinner','🌙','7–8 PM', o('Light Dal + Rice',15,320), o('Leftover Wrap',20,360))
      )
    ]
  },
  week4:{
    desc:'Reset week · simple meals before the monthly cycle repeats',
    days:[
      d('Monday','Simple repeat',
        m('Breakfast','🌅','7–8 AM', o('Whey + Banana',25,220), o('Eggs + Toast',18,300)),
        m('Lunch','☀️','12–1 PM', o('Paneer Sandwich + Cucumber',20,420), o('Egg Sandwich',22,380)),
        m('Dinner','🌙','7–8 PM', o('Dal + Rice',15,350), o('Chicken + Roti',30,430))
      ),
      d('Tuesday','Light lunch',
        m('Breakfast','🌅','7–8 AM', o('Poha + Curd',12,350), o('Smoothie',15,360)),
        m('Lunch','☀️','12–1 PM', o('Chickpea Salad + Bread',17,390), o('Sprouts Chaat + Roti',15,360)),
        m('Dinner','🌙','7–8 PM', o('Paneer Bhurji + Roti',24,420), o('Egg Bhurji',24,350))
      ),
      d('Wednesday','Protein day',
        m('Breakfast','🌅','7–8 AM', o('Whey + Milk',28,260), o('Omelette + Toast',20,320)),
        m('Lunch','☀️','12–1 PM', o('Chicken Rice Bowl',30,460), o('Paneer Roll',20,430)),
        m('Dinner','🌙','7–8 PM', o('Dal + Roti',15,320), o('Chicken Stir Fry + Salad',30,380))
      ),
      d('Thursday','Office easy',
        m('Breakfast','🌅','7–8 AM', o('Upma + Curd',12,350), o('PB Toast',12,330)),
        m('Lunch','☀️','12–1 PM', o('Boiled Egg Salad + Toast',22,370), o('Paneer + Rice + Salad',22,460)),
        m('Dinner','🌙','7–8 PM', o('Dal + Rice',15,350), o('Paneer Stir Fry',22,360))
      ),
      d('Friday','Flexible protein',
        m('Breakfast','🌅','7–8 AM', o('Whey Shake',25,150), o('Eggs + Banana',18,290)),
        m('Lunch','☀️','12–1 PM', o('Chicken Sandwich',28,420), o('Chickpea Chaat Salad',17,360)),
        m('Dinner','🌙','7–8 PM', o('Egg Bhurji + Roti',24,400), o('Chicken + Salad',30,360))
      ),
      d('Saturday','Weekend simple',
        m('Breakfast','🌅','7–8 AM', o('PB Banana Toast',12,380), o('Whey + Banana',25,220)),
        m('Lunch','☀️','12–1 PM', o('Paneer Rice Bowl',22,460), o('Chicken Wrap',30,450)),
        m('Dinner','🌙','7–8 PM', o('Dal + Rice',15,350), o('Paneer Bhurji',24,360))
      ),
      d('Sunday','Monthly reset',
        m('Breakfast','🌅','7–8 AM', o('Fruit + Curd',12,280), o('Omelette + Toast',20,320)),
        m('Lunch','☀️','12–1 PM', o('Egg Roll',22,420), o('Paneer Sandwich',20,420)),
        m('Dinner','🌙','7–8 PM', o('Light Dal + Rice',15,320), o('Leftover Wrap',20,360))
      )
    ]
  }
};

/* ════════════════════════════════════
   SHOPPING DATA
════════════════════════════════════ */
const SHOP = {
  weekly:{
    week1:{
      proteins:[
        {n:'Eggs',q:'12–14 pcs'},{n:'Chicken (boneless)',q:'400–500g'},
        {n:'Paneer',q:'200g'},{n:'Whey Protein 🔵 Gyaan only',q:'Check stock'}
      ],
      carbs:[
        {n:'Whole Wheat Bread',q:'2 loaves'},{n:'Rice',q:'500g'},
        {n:'Atta',q:'1 kg'},{n:'Poha',q:'200g'}
      ],
      produce:[
        {n:'Onion',q:'4–5 pcs'},{n:'Tomato',q:'6–8 pcs'},
        {n:'Cucumber',q:'4–5 pcs'},{n:'Sprouts (ready pack)',q:'200g'}
      ],
      pantry:[
        {n:'Peanut Butter',q:'Check stock'},{n:'Chickpeas (canned)',q:'2 cans'},
        {n:'Toor / Moong Dal',q:'500g'},{n:'Basic spices + oil',q:'Check stock'}
      ]
    },
    week2:{
      proteins:[
        {n:'Eggs',q:'12 pcs'},{n:'Chicken (boneless)',q:'500g'},
        {n:'Paneer',q:'250g'},{n:'Whey Protein 🔵 Gyaan only',q:'Check stock'}
      ],
      carbs:[
        {n:'Whole Wheat Bread',q:'2 loaves'},{n:'Rice',q:'500g'},
        {n:'Atta',q:'500g'},{n:'Wraps / Chapati (readymade)',q:'1 pack'}
      ],
      produce:[
        {n:'Onion',q:'4 pcs'},{n:'Tomato',q:'6 pcs'},
        {n:'Cucumber',q:'4 pcs'},{n:'Mixed salad greens',q:'1 bag'}
      ],
      pantry:[
        {n:'Peanut Butter',q:'Check stock'},{n:'Chickpeas (canned)',q:'2 cans'},
        {n:'Dal',q:'500g'},{n:'Light mayo',q:'1 small jar'}
      ]
    },
    week3:{
      proteins:[
        {n:'Eggs',q:'14 pcs'},{n:'Chicken (boneless)',q:'600–700g'},
        {n:'Paneer',q:'200g'},{n:'Whey Protein 🔵 Gyaan only',q:'Check stock'}
      ],
      carbs:[
        {n:'Whole Wheat Bread',q:'2 loaves'},{n:'Rice',q:'500g'},
        {n:'Atta',q:'500g'},{n:'Sprouts',q:'300g'}
      ],
      produce:[
        {n:'Onion',q:'5 pcs'},{n:'Tomato',q:'7 pcs'},
        {n:'Cucumber',q:'5 pcs'},{n:'Bell pepper (for stir fry)',q:'2–3 pcs'}
      ],
      pantry:[
        {n:'Peanut Butter',q:'Check stock'},{n:'Chickpeas (canned)',q:'1 can'},
        {n:'Dal',q:'500g'},{n:'Soy sauce + olive oil',q:'Check stock'}
      ]
    },
    week4:{
      proteins:[
        {n:'Eggs',q:'12 pcs'},{n:'Chicken (boneless)',q:'400g'},
        {n:'Paneer',q:'200g'},{n:'Whey Protein 🔵 Gyaan only',q:'Check stock'}
      ],
      carbs:[
        {n:'Whole Wheat Bread',q:'2 loaves'},{n:'Rice',q:'500g'},
        {n:'Atta',q:'500g'},{n:'Poha',q:'200g'}
      ],
      produce:[
        {n:'Onion',q:'4 pcs'},{n:'Tomato',q:'6 pcs'},
        {n:'Cucumber',q:'4 pcs'},{n:'Sprouts',q:'200g'}
      ],
      pantry:[
        {n:'Peanut Butter',q:'Check stock'},{n:'Chickpeas (canned)',q:'2 cans'},
        {n:'Dal',q:'500g'},{n:'Basic condiments',q:'Check stock'}
      ]
    }
  },
  daily:{
    everyday:[
      {n:'Milk',q:'500ml – 1L'},{n:'Curd / Yogurt',q:'400g'},{n:'Bananas',q:'3–4 pcs'}
    ],
    altday:[
      {n:'Seasonal fruit (apple / papaya / mango)',q:'2–3 pcs'},
      {n:'Fresh coriander',q:'1 bunch'},{n:'Lemon',q:'3–4 pcs'},
      {n:'Green chillies',q:'10–12 pcs'},{n:'Garlic',q:'1 bulb'}
    ],
    once:[
      {n:'Flax / chia seeds',q:'Check stock'},
      {n:'Olive oil / ghee',q:'Check stock'},
      {n:'Protein bars / nuts (emergency snack)',q:'1 pack'}
    ]
  }
};
