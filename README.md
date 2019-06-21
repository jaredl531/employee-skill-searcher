# Employee Skill Searcher

Developed as a hackday project at [Clarifai](https://www.clarifai.com) in early 2019, this is a simple search engine to discover what skills your colleagues have and which people are willing to mentor others in those skills.

A live demo of this can be viewed [here](https://jared-hack-projects.s3.us-east-2.amazonaws.com/employee-skill-searcher/index.html) and an accompanying blog post that mentions this project can be found [here](https://www.clarifai.com/blog/another-march-of-innovation-at-clarifai-hack-day-highlights).
<br/><br/>

<img src="https://jared-hack-projects.s3.us-east-2.amazonaws.com/employee-skill-searcher/Screenshots/main-screen1.png"/>

## Backstory

Setting this up took a bit of manual work because I needed to scrape everyone's LinkedIn profiles and a few internal surveys to gather their skillsets. Once this was stored inside of peopleTags.js via dictionaries and arrays I just needed to add the parsing code to determine who to show in the results, and then some HTML to display it nicely.

## How To Setup

If you want to use this for your own company then there's a few things that you need to do:

1. Replace the photos in the Employee-Photos folder with photos of your own employees. The code is written to read these as first-last.jpg at the moment.

2. Edit all of the dictionaries in peopleTags.js so that they are applicable to your company's staff. The Slack IDs may take some digging to find but I promise you, they are retrievable.

3. That's pretty much it.

## How This Works

### Parsing

The parser is configured to search for one word at a time and it's smart enough to ignore unnecessary content and answer questions such as:

```
Who knows Python or SQL?
Who speaks Spanish?
Who can I play in chess?
```

Additionally, if you're looking for a common term with two or more words, such as Machine Learning, you'll want to put quotes around that:

```
Who can teach me to be a "Machine Learning" wizard?
```

### Features

1. **Mentors** - If you search for a term and it appears in someone's mentorTags dictionary value array, then you'll see a lightbulb appear on that person's picture, indicating that they are indeed a mentor in that subject. You can filter by just mentors by selecting the litle checkbox next to the search bar if you'd like.

2. **Random Search** - If you hit the "I'm Feeling Taggy" button it will first look for an active search term in the box. If a term does exist there, then you'll get one random result of someone who has it in their arsenal. If the box is _blank_ though, then you will get a random person for a random term, which is a lot of fun to just scroll through sometimes.

3. **Slack Messages** - The tool is configured to open up a direct Slack message with someobody if you click on their picture, though as mentioned in the previous section, this _does_ require finding everyone's Slack IDs and also your Team ID.

4. **Tooltip Hovering** - If you're curious about all of somebody's skills in the search results you can hover over their picture and a tooltip will tell you: a) Everything they know, and b) What they are willing to mentor in.
