var horse = `
                               _(|_/) 
                             ,((((^.|
                            ((((  (6 | 
                          ,((((( ,    |
      ,,,_              ,(((((  /"._  ,.,
     ((((|| ,...       ,((((   /     -.-'
     )))  ;'    ."'"'""((((   (      
    (((  /            (((      
     )) |                      |
    ((  |        .       '     |
    ))  |     _ '      .t   ,.')
    (   |   y;- -,-""'"-.|   |/  
    )   / ./  ) /         .|  |
       |./   ( (           / /'
       ||     ||          //'|
       ||      ||       _//'||
       ||       ))     |_/  ||
       |_|     |_/          ||
       .'"                  |_|
                            .'" 
`;

var logo = `
 
 :::::::::::::::::::::::::::::::::::::::::::::
               powerd by Vicom   
 :::::::::::::::::::::::::::::::::::::::::::::  
    
`;

function createLogo(str, cnN){
  var ln = 50, cnN = cnN || 0;
  var strN = str.length;
  var space = (ln - strN - cnN) / 2;
  var center = '';
  for(var i = 0; i< space; i++){
    center += ' ';
  }
  center += str;
  //
  var line = '';
  for(var i = 0; i < ln; i++){
    line += ':';
  }
  return [line, center, line].join('\n');
}

module.exports = {
  horse: horse,
	logo: logo,
  createLogo: createLogo
};