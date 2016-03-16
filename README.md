# Punch

The most basic of time trackers.

## Install

1. Set up a cloudant database called 'punch'
1. Inside this: Create a cloudant document called 'punch-data'
1. Inside that: Create a JSON object for your entries
1. Add cloudant env vars to your secret: `~/.apikeys` file
1. Clone this repo: `git clone git@github.com:F1LT3R/punch.git`
1. Change dir: `cd punch`
1. Install globally: `npm install -g`
1. Follow usage instructions

### 3 - Create JSON Object for Entries

Something like this:

```json
{
  "_id": "punch-data",
  "_rev": "12-cd29fa4b320sce20d002df5db81cc356",
  "entries": {
  }
}
```


### 4 - API Keys as Env Vars

Do keep them secret:

```bash
# Cloudant DB Services
export CLOUDANT_USERNAME="yourDomainUser"
export CLOUDANT_TEST_USERNAME="yourAccessUser"
export CLOUDANT_TEST_PASSWORD="yourAccessKey"

```

## Usage Instructions


### Help

Read the help: `punch --help`

```shell
⮀ punch --help

  Usage: punch [options] [type] [note] [time]

  the most basic of time trackers

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    -v, --verbose  Turn on verbose messages
```

### punch `in`

Punch in w/ a note: `punch in "Starting work :'("`

```shell
⮀ punch in "Starting work :'("

Wed Mar 16 2016 01:19:34 GMT-0400 (EDT)
Time punched to local file
Time punched to remote database
```

Punch in w/o a note: `punch in`


### punch `out`

Punch out w/ a note: `punch out "Lunch time! :D"`

```shell
⮀ punch out "Lunch time! :D"

Wed Mar 16 2016 01:24:01 GMT-0400 (EDT)
Time punched to local file
Time punched to remote database
```

Punch out w/o a note: `punch out "Lunch time! :D"`


### punch `open`

Open local punch data file: `punch open`

```javascript
// Opens file w/ contents:
{"type":"in","note":"Starting work :'(","timestamp":1458105574829,"datestring":"Wed Mar 16 2016 01:19:34 GMT-0400 (EDT)"}
{"type":"out","note":"Lunch time! :D","timestamp":1458105841632,"datestring":"Wed Mar 16 2016 01:24:01 GMT-0400 (EDT)"}
```

### punch `read`

Read remote punch database: `punch read`

```javascript
# Logs to STDOUT:
{"type":"in","note":"Starting work :'(","timestamp":1458105574829,"datestring":"Wed Mar 16 2016 01:19:34 GMT-0400 (EDT)"},"1458105841632":{"type":"out","note":"Lunch time! :D","timestamp":1458105841632,"datestring":"Wed Mar 16 2016 01:24:01 GMT-0400 (EDT)"}}
```
