# hop-cli
command line interface for hop

npm install hop-cli -g


Usage: hop [options] [command]

cli health oracle protocol

Options:
  -v, --version                      output the version number
  -h, --help                         display help for command

Commands:
  launch [options] [launch]          start HOP
  library [options] [library]        query the network library
  hopmessage [options] [hopmessage]  hop message
  help [command]                     display help for command


This is still experimental.  Goal is to read Module and Reference Contracts from the network library (then add data via the cli to use in bentoboxds.org).

Works in interactive mode only at this stage, (assuming contracts added already) for exmaple:

hop launch

$ Type of reference contract 
  bentoboard 
❯ library 

? Style of contract (Use arrow keys)
❯ reference 
  module 
  exit 

? View contract (Use arrow keys)
  datatype 
❯ compute 
  data 
  visualisation 
  exit 


❯ datatype 
  compute 
? View contract compute
? Please enter contract ID f020a98b100ac40c109a1488220e9874cfa3f43a

{
  type: 'datatype-rc',
  data: {
    seq: 17,
    key: 'f020a98b100ac40c109a1488220e9874cfa3f43a',
    value: {
      refcontract: 'compute',
      concept: {},
      computational: {
        name: 'Observation',
        description: 'view data',
        primary: 'yes',
        dtprefix: '355fd3704781a4f15236fe13b6f2ed3ebf756a84',
        code: 'none',
        hash: 'none'
      }
    }
  }
