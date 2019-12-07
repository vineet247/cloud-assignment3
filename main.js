$(document).ready(function() {
    var you = "Me";
    botSays("Hi how may i help you today ?")
});

function getUrlVars() 
{
	var vars = {};
	var parts = window.location.href.replace(/[?#&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
			vars[key] = value;
	});
	return vars;
}

function textHitEnter(ele) 
{
    if(event.key === 'Enter') {
        answer(document.getElementsByTagName('input')[0].value);    
    }
}
// var id_token = getUrlVars()["id_token"];
// console.log('id_token: ' + id_token);

// AWS.config.region = 'us-east-1';
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//     IdentityPoolId: 'us-east-1:9f8c6f91-716d-4f9d-9683-1e91b7f512e6',
//     Logins: {
//         'cognito-idp.us-east-1.amazonaws.com/us-east-1_8ggOPx3UY': id_token
//     }
// });
// var apigClient;
// AWS.config.credentials.refresh(function(){
//     var accessKeyId = AWS.config.credentials.accessKeyId;
//     var secretAccessKey = AWS.config.credentials.secretAccessKey;
//     var sessionToken = AWS.config.credentials.sessionToken;
//     AWS.config.region = 'us-east-1';
//     apigClient = apigClientFactory.newClient({
//         accessKey: AWS.config.credentials.accessKeyId,
//         secretKey: AWS.config.credentials.secretAccessKey,
//         sessionToken: AWS.config.credentials.sessionToken, // this field was missing
//         region: 'us-east-1'
//     });
// });


function searchImages(x) 
{
    document.getElementsByTagName("input")[0].value = "";
    callAwsForGETImages(x);
}

function botSays(x) 
{
    document.getElementById("result-text").style.display = "none";
    for (var i = 0; i < x.length; i++)
    {

    }
}

function errorShowNoImage()
{
    document.getElementById("result-text").style.display = "block";
    document.getElementsByTagName("textarea")[0].innerHTML = "Could not find images for the given search query!";
}

function callAwsForGETImages(x) 
{
    talking = true;
    let params = {};
    let additionalParams = {
        headers: {
            "x-api-key" : 'r9C1YSEkFv8YBkHaBtUaW8cf5mnreaeF7pbgZm7G',
        }
    };
    var body = {
        "message" : x
    }
    apigClient.chatbotPost(params, body, additionalParams)
        .then(function(result) {
            x = result.data.body;
            botSays(x);
            console.log(result);
        }).catch(function(result) {
            // Add error callback code here.
            errorShowNoImage();
            console.log(result);
        });
}

function enterButton(e, x) 
{
    if (e.keyCode == 13) 
    {
        answer(x);
    }
}

function setCharAt(str, index, chr) 
{
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
}



function searchPhoto()
{
    var apigClient = apigClientFactory.newClient({
        apiKey: "r9C1YSEkFv8YBkHaBtUaW8cf5mnreaeF7pbgZm7G"
    });

    var user_message = document.getElementById('search-img-text').value;
    // console.log(user_message);
    var body = { };
    var params = {q : user_message};
    var additionalParams = {headers: {
        'Content-Type':"application/json"
    }};

    apigClient.searchGet(params, body , additionalParams).then(function(res){
        var data = {}
        var data_array = []
        resp_data  = res.data
        length_of_response = resp_data.length;
        if(length_of_response == 0)
        {
            document.getElementById("result-text").innerHTML = "No Images Found !!!"
            document.getElementById("result-text").style.display = "block";
        }
        data = JSON.parse(resp_data.body).results;
        console.log(data);
        document.getElementById("result-text").innerHTML = "Images returned are: ";
        document.getElementById("result-text").style.display = "block";
        for (var i = 0; i < data.length; i++)
        {
            var img = new Image();
            img.src = data[i];
            // img.src = "https://l7gbepckec.execute-api.us-east-1.amazonaws.com/Prod/search/q='human'";
            img.setAttribute("class", "banner-img");
            img.setAttribute("alt", "effy");
            img.setAttribute("display", "block");
            img.setAttribute("width", "200px");
            img.setAttribute("height", "200px");
            document.getElementById("images-output").appendChild(img);
        }
      }).catch( function(result){
      });
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // reader.onload = () => resolve(reader.result)
    reader.onload = () => {
      let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
      if ((encoded.length % 4) > 0) {
        encoded += '='.repeat(4 - (encoded.length % 4));
      }
      resolve(encoded);
    };
    reader.onerror = error => reject(error);
  });
}



function uploadPhoto()
{
   // var file_data = $("#file_path").prop("files")[0];
   var file = document.getElementById('fileToUpload').files[0];
   const reader = new FileReader();

   var file_data;
   // var file = document.querySelector('#file_path > input[type="file"]').files[0];
   var encoded_image = getBase64(file).then(
     data => {
     console.log(data)
     var apigClient = apigClientFactory.newClient({
            apiKey: "r9C1YSEkFv8YBkHaBtUaW8cf5mnreaeF7pbgZm7G"
    });

     // var data = document.getElementById('file_path').value;
     // var x = data.split("\\")
     // var filename = x[x.length-1]
     var file_type = file.type + ";base64"

     var body = data;
     var params = {"key" : file.name, "bucket" : "photubucket", "Content-Type" : file.type};
     var additionalParams = {};
     console.log("sdfsd");
     apigClient.uploadBucketKeyPut(params, body , additionalParams).then(function(res){
       if (res.status == 200)
       {
         document.getElementById("result-text").innerHTML = "Image Uploaded  !!!"
         document.getElementById("result-text").style.display = "block";
       }
     })
   });

}