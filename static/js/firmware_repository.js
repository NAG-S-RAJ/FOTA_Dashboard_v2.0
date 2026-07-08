const SERVER = "https://fota-demo-v2-0.onrender.com";

async function loadLatestFirmware(){

    const response =
        await fetch(
            SERVER + "/latest_firmware"
        );

    const data =
        await response.json();

    document.getElementById("latestSGW").innerText =
        data.SGW.version;

    document.getElementById("latestBCM").innerText =
        data.BCM.version;

    const div =
        document.getElementById(
            "latestFirmwareList"
        );

    div.innerHTML = "";

    ["SGW","BCM"].forEach(ecu=>{

        div.innerHTML += `
        <div class="latestItem">

            <h3>${ecu}</h3>

            <p>
                Version :
                ${data[ecu].version}
            </p>

            <p>
                ${data[ecu].file}
            </p>

            <a
                href="${data[ecu].download_url}"
                target="_blank">

                Download Firmware

            </a>

        </div>
        `;

    });

}

async function uploadFirmware(){

    const ecu =
        document.getElementById(
            "ecu"
        ).value;

    const version =
        document.getElementById(
            "version"
        ).value.trim();

    const file =
        document.getElementById(
            "firmwareFile"
        ).files[0];

    if(!version || !file){

        alert("Fill all fields");

        return;

    }

    const formData =
        new FormData();

    formData.append(
        "ecu",
        ecu
    );

    formData.append(
        "version",
        version
    );

    formData.append(
        "file",
        file
    );

    const response =
        await fetch(

            SERVER +
            "/upload_firmware",

            {

                method:"POST",

                body:formData

            }

        );

    const result =
        await response.json();

    alert(result.status);

    loadLatestFirmware();

    loadHistory();

}

async function loadHistory(){

    const response =
        await fetch(
            SERVER +
            "/firmware_history"
        );

    const list =
        await response.json();

    document.getElementById(
        "firmwareCount"
    ).innerText =
        list.length;

    const div =
        document.getElementById(
            "historyList"
        );

    div.innerHTML = "";

    list.forEach(item=>{

        div.innerHTML += `
        <div class="historyItem">

            <div class="historyLeft">

                <b>

                    ${item.ecu}

                </b>

                <span>

                    ${item.file}

                </span>

            </div>

            <div class="historyRight">

                <button
                    class="downloadBtn"
                    onclick="window.open('${item.download_url}')">

                    Download

                </button>

            </div>

        </div>
        `;

    });

}

function refreshHistory(){

    loadLatestFirmware();

    loadHistory();

}

refreshHistory();