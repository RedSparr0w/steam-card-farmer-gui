# Steam Card Farmer - GUI Edition

# Installation

- Install [Node.js](https://nodejs.org) (v0.12.0 or later) or [io.js](https://iojs.org)
- Run from directory `sudo npm install` (Linux) or `npm install` from an [elevated command prompt](http://pcsupport.about.com/od/commandlinereference/f/elevated-command-prompt.htm) (Windows).

# Usage

If you have games with remaining drops which have less than 2 hours of playtime, the app will first mass-idle all of them up to 2 hours. Then it will start switching through them to get card drops. This is because it's now impossible to get card drops before your first 2 hours of gameplay.

If you have purchased a game in the past 14 days, **idling it will waive your right to a refund on Steam**. If you have apps which were purchased less than 14 days ago, have remaining drops, have less than 2 hours of playtime, and weren't redeemed from a CD key, complimentary, or a gift, the app will first prompt you which games you'd like to idle.

It'll automatically switch through all games you have with remaining card drops (it checks every 20 minutes or immediately when a new item is received). One could theoretically mass-idle all games at once, but it takes just as long and this way doesn't rack up unnecessary fake playtime.