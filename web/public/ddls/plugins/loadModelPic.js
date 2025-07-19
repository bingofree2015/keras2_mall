function loadModelPic1() {
	layout.style.display = "block"
	// console.log("ffffffffff")
	var xhr = new XMLHttpRequest()
	var url = "panos/uvobj/UVimagea.jpg" //模型贴图路径    加载完模型贴图 后面才会显示模型
	xhr.open("GET", url)
	xhr.onprogress = function (event) {
	  if (event.lengthComputable) {
		// console.log(event.loaded);
		// console.log(event.total);

		const percentComplete = (event.loaded / event.total) * 100
		console.log(percentComplete + "% loaded")
		zc.innerHTML = "模型加载  " + Math.round(percentComplete, 2) + "%"
		if (percentComplete == 100) {
		  // $('#modelMaterial').attr('src', url).show();
		  layout.style.display = "none"

		  var krpano = document.getElementById("krpanoSWFObject")
		  krpano.call("backs1();")
		}
	  }
	}
	xhr.send()
  }
 
  function loadModelPic2() {
	layout.style.display = "block"
	// console.log("ffffffffff")
	var xhr = new XMLHttpRequest()
	var url = "panos/uvobj/UVimageb.jpg" //模型贴图路径    加载完模型贴图 后面才会显示模型
	xhr.open("GET", url)
	xhr.onprogress = function (event) {
	  if (event.lengthComputable) {
		// console.log(event.loaded);
		// console.log(event.total);

		const percentComplete = (event.loaded / event.total) * 100
		console.log(percentComplete + "% loaded")
		zc.innerHTML = "模型加载  " + Math.round(percentComplete, 2) + "%"
		if (percentComplete == 100) {
		  // $('#modelMaterial').attr('src', url).show();
		  layout.style.display = "none"

		  var krpano = document.getElementById("krpanoSWFObject")
		  krpano.call("backs2();")
		}
	  }
	}
	xhr.send()
  }  

  function loadModelPic3() {
	layout.style.display = "block"
	// console.log("ffffffffff")
	var xhr = new XMLHttpRequest()
	var url = "panos/uvobj/UVimagec.jpg" //模型贴图路径    加载完模型贴图 后面才会显示模型
	xhr.open("GET", url)
	xhr.onprogress = function (event) {
	  if (event.lengthComputable) {
		// console.log(event.loaded);
		// console.log(event.total);

		const percentComplete = (event.loaded / event.total) * 100
		console.log(percentComplete + "% loaded")
		zc.innerHTML = "模型加载  " + Math.round(percentComplete, 2) + "%"
		if (percentComplete == 100) {
		  // $('#modelMaterial').attr('src', url).show();
		  layout.style.display = "none"

		  var krpano = document.getElementById("krpanoSWFObject")
		  krpano.call("backs3();")
		}
	  }
	}
	xhr.send()
  }   