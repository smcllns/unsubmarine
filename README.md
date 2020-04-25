# Unsubmarine

Hacking an auto-unsubscribe into gmail

## Problem Statement

It's less visible day to day - but if I go off the grid for a week, when I open my inbox there's a lot of email I really never wanted to receive. What I'd like is for a robot to go through my inbox and automatically unsubscribe me from any senders I don't want to hear from.

## Alternative Solutions (that aren't working for me)

1. Filters (either manual or gmail's automated filtering). Very helpful, but I still need to parse through lists to look for misses and keeping filters up to date and accurate is becoming a lot of work. Simply, it would be better if the noise was never there.

1. Gmail's "auto-unsubscribe". Overall, I think gmail team could do a _lot more_ here. I don't know why they don't - maybe it's a perverse conflict of interest (maybe automatically cleaning up my email reduces core metrics visitation/engagement), or maybe this is just a lower priority area vs areas of growth for gmail.

1. Manually unsubscribe to each email as I receive it. As per the problem statement, this isn't working for me. I'll spare the psychological analysis for why this might be.

1. Use clever email aliases (e.g. myemail+spam@gmail.com). At least two reasons this doesn't work for me - a) at signup time, I don't know if they're going to be spammy/forget to use my clever email suffix b) sometimes not an option if I _Sign-in with X_ and my email address is automatically shared as is.

1. Browser Extensions/Apps that do this. I can only find unroll.me - which is opaque in how it works and mines my inbox for business intelligence on behalf of Rakuten (you can opt-out), but just freaks me out a bit. I'd happily pay \$10 for a spring clean instead.

## How should this work?

This is a work in progress. To start with, I'd like to achieve the following:

- Create an easy workflow to keep my inbox clean - e.g. a periodic spring clean of my inbox every X months.
- Give me a way to batch unsubscribe to multiple senders in one-click.
- Let me approve so I don't unsubscribe from something I didn't want to.
- Don't require that I enter clever email addresses at sign-up time.

## How to try out this prototype:

1. Go to gmail in your browser on a computer
2. Add index.js to the DOM (open the JS console and copy paste index.js into it)
3. Prepare a list of emails to loop through. I suggest starting with [mail.google.com/search/unsubscribe](mail.google.com/search/unsubscribe) but you can use any list of messages
4. Click the first message in the message.
5. At this point you should be looking at an email message, with Prev/Next buttons at the top of the message that will take you to the next email in the list.
6. In the browser console start the script by entering: `unsubmarine()`
