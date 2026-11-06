import type { Trip } from "./types";

/** Fictional family memories used only to demonstrate the album experience. */
export const trips: Trip[] = [
  {
    slug: "iceland",
    title: "Iceland",
    subtitle: "The long way around.",
    country: "Iceland",
    city: "Reykjavík & Vík",
    notes: "Our first family road trip. Twelve days following the south coast.",
    date: "2016-07-14",
    cover_photo: "/images/iceland.jpg",
    continent: "Europe",
    year: 2016,
    startDate: "2016-07-14",
    endDate: "2016-07-25",
    travelers: ["Dad", "Mom", "Gordon", "Emma"],
    coordinates: [-19.02, 64.96],
    cover: "/images/iceland.jpg",
    coverAlt:
      "A green Icelandic valley beneath dramatic mountains and a waterfall",
    accent: "#8057d8",
    story: [
      "We landed with one suitcase too many, a paper map, and absolutely no idea what time it was. The sun never really went down. For the next twelve days, neither did our curiosity.",
      "Our little rental car carried us from Reykjavík to the south coast, past fields of horses and waterfalls that appeared around every bend. We stopped whenever someone said, ‘Look at that.’ Which, as it turned out, was often. The itinerary became more of a suggestion than a plan.",
      "I remember the big things, of course: the black sand at Vík, the blue-white ice drifting through Jökulsárlón, the impossible scale of the mountains. But I remember the small things just as clearly. Hot soup after a rainy walk. Emma naming every sheep. All four of us laughing in a gas-station parking lot because we had taken the wrong road again.",
      "This was the trip that started it all. Not because it was perfect, but because we came home with the same thought: let's keep doing this. Let's keep going somewhere together.",
    ],
    itinerary: [
      {
        day: "Days 01–02",
        title: "Reykjavík",
        description:
          "Colorful streets, our first Icelandic breakfast, and a slow start by the harbor.",
      },
      {
        day: "Days 03–05",
        title: "The Golden Circle",
        description:
          "Þingvellir, Geysir, Gullfoss, and every roadside stop in between.",
      },
      {
        day: "Days 06–09",
        title: "The south coast",
        description:
          "Waterfalls, black-sand beaches, and a small guesthouse near Vík.",
      },
      {
        day: "Days 10–12",
        title: "Glaciers & the way home",
        description:
          "Jökulsárlón at first light, then the long, beautiful drive back west.",
      },
    ],
    photos: [
      {
        id: "iceland-01",
        title: "Where it all began",
        src: "/images/iceland.jpg",
        alt: "Lush green mountains and a waterfall in Iceland",
        caption:
          "One of those places that made all four of us go quiet. We stayed much longer than we meant to.",
        location: "South coast, Iceland",
      },
      {
        id: "iceland-02",
        title: "Under the waterfall",
        src: "/images/iceland-waterfall.jpg",
        alt: "Skógafoss waterfall cascading between moss-covered cliffs",
        caption:
          "The forecast said rain. We went anyway. Our shoes were wet for the rest of the day, and no one minded.",
        location: "Southern Iceland",
      },
      {
        id: "iceland-03",
        title: "One more angle",
        src: "/images/iceland-road.jpg",
        alt: "Svartifoss waterfall flowing over black basalt columns",
        caption:
          "A short walk turned into a long afternoon. Dad kept finding just one more angle.",
        location: "Svartifoss, Iceland",
      },
    ],
  },
  {
    slug: "south-africa",
    title: "South Africa",
    subtitle: "Wild days. Wide-open skies.",
    country: "South Africa",
    city: "Cape Town",
    notes:
      "Coastal roads, safari mornings, and a trip Grandma had always dreamed of.",
    date: "2017-08-05",
    cover_photo: "/images/south-africa.jpg",
    continent: "Africa",
    year: 2017,
    startDate: "2017-08-05",
    endDate: "2017-08-19",
    travelers: ["Dad", "Mom", "Gordon", "Emma", "Grandma"],
    coordinates: [24.0, -29.0],
    cover: "/images/south-africa.jpg",
    coverAlt:
      "An expansive African landscape stretching toward distant mountains",
    accent: "#7752b9",
    story: [
      "Grandma said she had always wanted to see Africa. So we booked five tickets, bought a pair of binoculars, and set off on a trip that had been a long time coming.",
      "Cape Town gave us a little of everything: mountain mornings, ocean afternoons, and dinners that lasted until someone finally admitted they were falling asleep. We drove the peninsula with the windows down, stopped for penguins, and watched the clouds pour over Table Mountain like a slow waterfall.",
      "Then came the bush. Every morning began before sunrise, wrapped in blankets in the back of an open vehicle. We learned to look closely. A branch became a bird. A shadow became an elephant. On our second morning, a whole herd crossed the road in front of us, the smallest calf tucked safely in the middle. Grandma didn't say a word. She just held Mom's hand.",
      "There are trips you remember for the places, and trips you remember for the people you were with. This one will always be both.",
    ],
    itinerary: [
      {
        day: "Days 01–04",
        title: "Cape Town",
        description:
          "Table Mountain, neighborhood wanderings, and long family dinners.",
      },
      {
        day: "Days 05–07",
        title: "The Cape Peninsula",
        description:
          "Coastal roads, Boulders Beach penguins, and the Cape of Good Hope.",
      },
      {
        day: "Days 08–10",
        title: "The Winelands",
        description:
          "A slower few days among the mountains and vineyards of Stellenbosch.",
      },
      {
        day: "Days 11–15",
        title: "Safari mornings",
        description:
          "Early game drives, quiet afternoons, and stories around the fire.",
      },
    ],
    photos: [
      {
        id: "south-africa-01",
        title: "Wide-open skies",
        src: "/images/south-africa.jpg",
        alt: "A wide African landscape in warm light",
        caption:
          "The first morning out. Everything seemed bigger than we had imagined—the sky, the silence, the space.",
        location: "South Africa",
      },
      {
        id: "south-africa-02",
        title: "A moment with the elephants",
        src: "/images/south-africa-elephants.jpg",
        alt: "Elephants in the African landscape",
        caption:
          "We turned the engine off and watched. Grandma said afterward that this was the moment she'd been waiting for.",
        location: "On safari",
      },
      {
        id: "south-africa-03",
        title: "A last look at Cape Town",
        src: "/images/south-africa-coast.jpg",
        alt: "A view of Cape Town and its surrounding landscape",
        caption:
          "One last look before we headed inland. We promised ourselves we'd come back.",
        location: "Cape Town, South Africa",
      },
    ],
  },
  {
    slug: "paris",
    title: "Paris",
    subtitle: "A few autumn days, just for us.",
    country: "France",
    city: "Paris",
    continent: "Europe",
    year: 2017,
    notes:
      "A little October escape: riverside walks, warm pastries, and no particular hurry.",
    date: "2017-10-10",
    startDate: "2017-10-10",
    endDate: "2017-10-14",
    travelers: ["Dad", "Mom", "Gordon", "Emma"],
    coordinates: [2.35, 48.85],
    cover: "/images/paris.jpg",
    cover_photo: "/images/paris.jpg",
    coverAlt: "The Eiffel Tower rising above Paris in the evening light",
    accent: "#9365c9",
    story: [
      "We had barely unpacked from our big summer adventure when we started talking about another little escape. Paris in October turned out to be exactly what we needed: five days, comfortable shoes, and the sort of weather that makes a warm café feel like the best place in the world.",
      "We spent our mornings walking along the Seine and our afternoons following whichever street looked interesting. Dad photographed the bridges. Mom found a favorite bakery. Gordon and Emma made a very serious project of comparing pastries. By the second day, we had all stopped checking the time.",
      "Our last evening was simple. A walk after dinner, the lights coming on along the river, and a few minutes together watching the Eiffel Tower. We had done a lot of traveling that year. This little trip reminded us that a few good days can hold just as much as a much bigger journey.",
    ],
    itinerary: [
      {
        day: "Day 01",
        title: "An autumn arrival",
        description:
          "A neighborhood walk, an early dinner, and a first glimpse of the river.",
      },
      {
        day: "Days 02–03",
        title: "Along the Seine",
        description:
          "Bridges, bookstalls, a museum morning, and plenty of time for café stops.",
      },
      {
        day: "Days 04–05",
        title: "The scenic way home",
        description:
          "A slow day around Montmartre, a final riverside evening, and one last bakery visit.",
      },
    ],
    photos: [
      {
        id: "paris-01",
        title: "The city lights up",
        src: "/images/paris.jpg",
        alt: "The Eiffel Tower beside the Seine beneath a dusky sky",
        caption:
          "We had seen it in so many photographs. We still stopped and stared when it appeared at the end of the street.",
        location: "Paris, France",
      },
      {
        id: "paris-02",
        title: "A favorite corner",
        src: "/images/paris-streets.jpg",
        alt: "Ornate lamps lighting the Pont Alexandre III bridge at dusk",
        caption:
          "Our plan was to walk for ten minutes before dinner. An hour later, we were still finding reasons to cross another bridge.",
        location: "Paris, France",
      },
      {
        id: "paris-03",
        title: "One more evening walk",
        src: "/images/paris-river.jpg",
        alt: "The Eiffel Tower seen at the end of a Paris neighborhood street",
        caption:
          "A little colder than we expected, a little later than we planned, and one of our favorite moments of the week.",
        location: "Paris, France",
      },
    ],
  },
  {
    slug: "china",
    title: "China",
    subtitle: "A journey back to our roots.",
    country: "China",
    city: "Beijing",
    continent: "Asia",
    year: 2018,
    notes: "Family stories, familiar flavors, and a walk along the Great Wall.",
    date: "2018-07-08",
    startDate: "2018-07-08",
    endDate: "2018-07-21",
    travelers: ["Dad", "Mom", "Gordon", "Emma"],
    coordinates: [116.41, 39.9],
    cover: "/images/china.jpg",
    cover_photo: "/images/china.jpg",
    coverAlt: "The Great Wall of China winding over green mountain ridges",
    accent: "#9365c9",
    story: [
      "Some journeys take you somewhere new. This one also brought us closer to where our family began. Dad had stories for every meal, every neighborhood, every familiar turn of phrase. We arrived ready to explore and found ourselves listening just as much as looking.",
      "Beijing was an unfolding series of contrasts: grand courtyards and tiny alleyways, quiet mornings and busy evening tables. We took the long way through the hutongs, ordered more dishes than we could finish, and let Dad translate the stories that didn't quite fit into English.",
      "Then there was the Great Wall. We climbed until our legs complained, stopped at a watchtower, and looked back at the path we'd taken. It stretched farther than any photograph could hold. For once, Dad put the camera down first. That is the moment I keep coming back to.",
    ],
    itinerary: [
      {
        day: "Days 01–04",
        title: "Beijing",
        description:
          "Settling in, family dinners, and slow walks through the old neighborhoods.",
      },
      {
        day: "Days 05–08",
        title: "Courtyards & city stories",
        description:
          "The Forbidden City, neighborhood markets, and afternoons following Dad's memories.",
      },
      {
        day: "Days 09–11",
        title: "The Great Wall",
        description:
          "A day at Mutianyu with an early start, plenty of water, and no hurry.",
      },
      {
        day: "Days 12–14",
        title: "One more family table",
        description:
          "Time for the people and places we wanted to see once more before flying home.",
      },
    ],
    photos: [
      {
        id: "china-01",
        title: "The long way up",
        src: "/images/china.jpg",
        alt: "The Great Wall following green mountain ridges",
        caption:
          "We kept saying we'd stop at the next watchtower. Then we saw the one after that.",
        location: "The Great Wall, China",
      },
      {
        id: "china-02",
        title: "Courtyard stories",
        src: "/images/china-palace.jpg",
        alt: "Historic Chinese architecture and ornate rooftops",
        caption:
          "The details were everywhere. Dad kept pointing out things we would have walked right past.",
        location: "Beijing, China",
      },
      {
        id: "china-03",
        title: "Following the old stones",
        src: "/images/china-city.jpg",
        alt: "Ancient stones and watchtowers along the Great Wall of China",
        caption:
          "One more walk before dinner. One more story from Dad along the way.",
        location: "China",
      },
    ],
  },
  {
    slug: "wimbledon",
    title: "Wimbledon",
    subtitle: "Strawberries, sunshine, and match point.",
    country: "United Kingdom",
    city: "London",
    continent: "Europe",
    year: 2023,
    notes:
      "A family day at the tennis, with a few extra days to wander London.",
    date: "2023-07-05",
    startDate: "2023-07-05",
    endDate: "2023-07-10",
    travelers: ["Dad", "Mom", "Gordon", "Emma"],
    coordinates: [-0.214, 51.434],
    cover: "/images/wimbledon.jpg",
    cover_photo: "/images/wimbledon.jpg",
    coverAlt: "A summer grass-court tennis match with spectators",
    accent: "#7752b9",
    story: [
      "Dad had watched Wimbledon every summer for as long as we could remember. This time, the familiar soundtrack of the ball and the crowd was all around us. We got there early, joined the queue, and treated our first strawberries and cream like a family tradition we'd somehow always had.",
      "There was a little rain, a lot of patient waiting, and more tennis than anyone could have asked for. We learned that following a rally in person involves the entire row moving their heads in perfect unison. We also learned that Dad's ‘one last match’ is a flexible unit of time.",
      "The rest of the week was London at an easy pace: park walks, long lunches, and finding our favorite corners of a city that always seems to have one more thing around the bend. But the tennis was the day we kept talking about on the flight home.",
    ],
    itinerary: [
      {
        day: "Days 01–02",
        title: "A London beginning",
        description:
          "Settling in, a walk along the river, and an early night before the tennis.",
      },
      {
        day: "Days 03–04",
        title: "The Championships",
        description:
          "A day in the grounds, strawberries and cream, and one more match for Dad.",
      },
      {
        day: "Days 05–06",
        title: "Time around town",
        description:
          "Neighborhood wandering, green parks, and a final family dinner.",
      },
    ],
    photos: [
      {
        id: "wimbledon-01",
        title: "A day at the tennis",
        src: "/images/wimbledon.jpg",
        alt: "A grass-court tennis match watched by summer spectators",
        caption:
          "We'd watched so many matches on television. Standing beside a real court felt completely different.",
        location: "A summer of tennis",
      },
      {
        id: "wimbledon-02",
        title: "Between the big points",
        src: "/images/wimbledon-tennis.jpg",
        alt: "Vintage tennis rackets and tennis balls on a blue surface",
        caption:
          "The little details between the big points. We had plenty of time to take it all in.",
        location: "At the tennis",
      },
      {
        id: "wimbledon-03",
        title: "One more match",
        src: "/images/wimbledon-court.jpg",
        alt: "A tennis player preparing to hit a ball on an outdoor court",
        caption:
          "Dad asked if we had time for one more match. Of course we did.",
        location: "A summer of tennis",
      },
    ],
  },
  {
    slug: "greece",
    title: "Greece",
    subtitle: "A slower kind of summer.",
    country: "Greece",
    city: "Santorini",
    continent: "Europe",
    year: 2025,
    notes: "Whitewashed lanes, blue horizons, and long dinners by the water.",
    date: "2025-06-15",
    startDate: "2025-06-15",
    endDate: "2025-06-25",
    travelers: ["Dad", "Mom", "Gordon", "Emma"],
    coordinates: [25.46, 36.39],
    cover: "/images/greece.jpg",
    cover_photo: "/images/greece.jpg",
    coverAlt: "White buildings and blue domes overlooking the sea in Santorini",
    accent: "#8057d8",
    story: [
      "Greece gave us permission to do less. We left the hotel before the streets got busy, followed the whitewashed lanes until they opened onto the sea, and found a table in the shade whenever someone suggested coffee.",
      "The days fell into an easy rhythm: a walk, a swim, a long lunch that almost became dinner. We watched the light change on the caldera and took far too many photographs of the same blue horizon. Somehow, every one looked different.",
      "On our last evening, we stayed at the table long after the plates had been cleared. No big plans, no early alarm, just the four of us talking while the island lights came on. Sometimes that is the whole adventure.",
    ],
    itinerary: [
      {
        day: "Days 01–03",
        title: "An island welcome",
        description:
          "Settling into Santorini with gentle walks and the first of many sea views.",
      },
      {
        day: "Days 04–07",
        title: "Oia & the caldera",
        description:
          "Whitewashed lanes, early mornings, and unhurried afternoons by the water.",
      },
      {
        day: "Days 08–11",
        title: "The slow way home",
        description:
          "A few final swims, favorite meals repeated, and one last sunset together.",
      },
    ],
    photos: [
      {
        id: "greece-01",
        title: "Blue horizons",
        src: "/images/greece.jpg",
        alt: "Whitewashed Santorini buildings overlooking the Aegean Sea",
        caption:
          "Every corner seemed to have a better view than the last. We stopped trying to choose a favorite.",
        location: "Santorini, Greece",
      },
      {
        id: "greece-02",
        title: "The nicest wrong turn",
        src: "/images/greece-village.jpg",
        alt: "Traditional buildings in a Greek island village",
        caption:
          "We went out for breakfast and came back after lunch. The best kind of wrong turn.",
        location: "Santorini, Greece",
      },
      {
        id: "greece-03",
        title: "The afternoon ahead",
        src: "/images/greece-coast.jpg",
        alt: "A coastal landscape in Greece",
        caption:
          "A little salt on our skin, nowhere else to be, and the rest of the afternoon ahead of us.",
        location: "Greece",
      },
    ],
  },
];
