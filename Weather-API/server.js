/**
 *
 * main() will be run when you invoke this action
 *
 * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
 *
 * @return The output of this action, which must be a JSON object.
 *
 */
var request = require("request-promise");

const DiscoveryV1 = require('ibm-watson/discovery/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

async function main(params) {
    
    // Se for para consultar uma das APIs
     if (params.type === "api") {
        try {
            //convert currency EUR to USD OU RUSD
            if (params.operation == "convertcurrency"){
                const urlParams = params.moedaorigem + `-` + params.moedaconversao;
                const url = `https://economia.awesomeapi.com.br/last/${urlParams}`;  
                
                const summary = await request({
                    method: "GET",
                    uri: url,
                    json: true,
                 });
                 
                const position = params.moedaorigem + params.moedaconversao;
                const moedavalor = summary[position].bid;
                const calcMoeda = params.quantidademoeda * moedavalor;
        
                    return {
                         result: `Conversão ${summary[position].name}: \n` +
                         `${params.quantidademoeda} ${params.moedaorigem} representam ${calcMoeda} ${params.moedaconversao} \n` +
                         `Fonte: Awesome API - Economia`,
                    };
            } 
            // check covid por concelho
            else if (params.operation == "statuscovid") {
                
               if (params.location) {
                 // Obtem lista de Concelhos  
                 const urlCheck = `https://covid19-api.vost.pt/Requests/get_county_list/`;  
                   
                 const locationsList = await request({
                     method: "GET",
                     uri: urlCheck,
                     json: true,
                  });    
                  
                  // Verifica se o concelho inserido se encontra na lista
                  var count = 0;
                  
                  for (var i = 0; i < locationsList.length; i++) {
                       if ( locationsList[i].toLowerCase() ===  params.location.toLowerCase()) {
                            count = count + 1;
                       }
                  }
                  
                  // Se o concelho estiver na lista
                  if (count > 0){
                     const url = `https://covid19-api.vost.pt/Requests/get_last_update_specific_county/${params.location}`;  
                       
                     const summary = await request({
                         method: "GET",
                         uri: url,
                         json: true,
                      });
             
                         return {
                              result: `Informações do concelho de ${summary[0].concelho}: \n` +
                                      `Distrito: ${summary[0].distrito} \n`+ 
                                      `Nivel de Risco: ${summary[0].incidencia_risco} \n`+ 
                                      `Casos em 14 dias: ${summary[0].casos_14dias} \n`+ 
                                      `Informação de : ${summary[0].data}` ,
                         };
                  } else {
                     return {
                          result: `Não encontrei a localização!`,
                     };
                  }
               }
            }
    
    
        } catch (err) {
          return { error: "it failed : " + err };
        }
    }
    // Se for para consultar o discovery
    else{

        const discovery = new DiscoveryV1({
            authenticator: new IamAuthenticator({ apikey: params.apikey }),
            serviceUrl: params.url,
        	version: '2021-04-22',
        });
        
        const offset = getRandomInt(50);
        
        const queryParams = {
                  environmentId: params.env_id,
                  collectionId: params.collection_id,
                  //natural_language_query: params.input,
                   query: params.inputQuery,
                  count: params.nrOcc,
                  offset: offset
                };
                

        
        try {
            
          data = await discovery.query(queryParams);
          let response;
          
          
          if (	params.type === "discoveryInstrucoes") {
            response = data.result.results.map((v, i) => {
                return `<b>${v.title}</b>
                         ${v.text}`;
             });   
          } else {
            response = data.result.results.map((v, i) => {
                return `<b>${v.question}</b>
                         ${v.answer}`;
             });
          }
          
         return {
            result:
              "<b>Aqui estão alguns artigos que encontramos. Não podemos verificar a exactidão de todas estas fontes.</b>\n\n" +
              response.join("\n\n"),
          };

          
        } catch (err) {
          return { error: "it failed : " + err };
        }
    }
}
