const diary_template = document.querySelector("#diary-template");
const diary_container = document.querySelector("#diary-container");

const instance = axios.create({
    baseURL: "http://localhost:5000/api",
});


//視窗
const modal = document.getElementById('diaryModal');
const btn = document.getElementById('openDiaryBtn');
const span = document.getElementsByClassName('close')[0];

const modal_edit = document.getElementById('diaryModal-edit');
const span_edit = document.getElementsByClassName('close-edit')[0];

btn.addEventListener('click', () => {
  modal.style.display = 'block';
});

span.addEventListener('click', () => {
  modal.style.display = 'none';
});

span_edit.addEventListener('click', () => {
  modal_edit.style.display = 'none';
});


//主程式
async function main() {
    setupEventListeners();
    try {
        const diarys = await getDiary();

        const diary_filter = document.querySelector("#diary-filter");

        console.log(diary_filter.value);

        diary_filter.addEventListener("change", () => {
            
          const selectedCategory = diary_filter.value;
          diary_container.innerHTML = ''; 

          diarys.forEach((diary) => {
            if (diary.tag === selectedCategory || diary.emotion === selectedCategory || selectedCategory === '全部') {
              renderDiary(diary);
             }
          });
        });

        diarys.forEach((diary) => {
          renderDiary(diary);
        });

    } catch (error) {
        alert("Failed to load diarys!");
    }
}

function setupEventListeners() {
    const add_button = document.querySelector("#diary-add");
    const diary_content_input = document.querySelector("#diary-content-input");
    const diary_image_input = document.querySelector("#diary-image-input");
    const diary_tag_input = document.querySelector("#diary-tag-input");
    const diary_emotion_input = document.querySelector("#diary-emotion-input");
    
    add_button.addEventListener("click", async () => { 
        const content = diary_content_input.value;
        const image = diary_image_input.value;
        const tag = diary_tag_input.value;
        const emotion = diary_emotion_input.value;
        //先創建一個Date實體
        var date = formatDate(new Date());
        
        if (!content) {
            alert("Please enter a content!");
            return;
        }
        if (tag == "請選擇你的標籤") {
          alert("Please select a tag!");
          return;
        }
        if (emotion == "請選擇你的心情") {
          alert("Please select a emotion!");
          return;
        }
        
        try {
            const diary = await createDiary({ date, content, image, tag, emotion });
            renderDiary(diary);
        } catch (error) {
            alert("Failed to create diary!");
            return;
        }
        diary_image_input.value = "";
        diary_content_input.value = "";
        diary_tag_input.value = "請選擇你的標籤";
        diary_emotion_input.value = "請選擇你的心情";

        alert("新增日記成功!");
        modal.style.display = 'none';
        return;
    });
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}
  
function formatDate(date) {

  const year = date.getFullYear();  
  const month = date.getMonth() + 1;  
  const day = date.getDate();  
  const dayOfWeek = date.getDay();

  // 将星期几转换为具体的文字表示
  const daysOfWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const dayOfWeekText = daysOfWeek[dayOfWeek];

  return (
    [
      year,
      padTo2Digits(month),
      padTo2Digits(day),
    ].join('.') +
    ' (' +
    dayOfWeekText + ')'
  );
}

function renderDiary(diary) {
    const item = createDiaryElement(diary);
    diary_container.appendChild(item);
}

function createDiaryElement(diary) {

    const item = diary_template.content.cloneNode(true);
    const container = item.querySelector(".diary-item");
    container.id = diary.id;
    console.log(diary);

    const editButton  = item.querySelector('button.edit-diary');
    editButton.dataset.id = diary.id;
    editButton.addEventListener("click", () => {
      modal_edit.style.display = 'block';
      console.log(diary);

      const diary_date_edit = document.querySelector("#diary-date-edit");
      const diary_content_input_edit = document.querySelector("#diary-content-input-edit");
      const diary_image_input_edit = document.querySelector("#diary-image-input-edit");
      const diary_tag_input_edit = document.querySelector("#diary-tag-input-edit");
      const diary_emotion_input_edit = document.querySelector("#diary-emotion-input-edit");

      diary_date_edit.value = diary.date.substr(0, diary.date.length - 6);
      diary_content_input_edit.value = diary.content;
      diary_image_input_edit.value = diary.image;
      diary_tag_input_edit.value = diary.tag;
      diary_emotion_input_edit.value = diary.emotion;
      // currentDiary = diary;

      let have_cancel = false;

      const cancelEditButton  = document.querySelector('#diary-cancel');

      cancelEditButton.addEventListener("click", () => {
        modal_edit.style.display = 'none';
        have_cancel = true;
        return;
      });

      if(have_cancel){
        return;
      }

      const saveEditButton  = document.querySelector('#diary-save');

      saveEditButton.addEventListener("click", () => {

        const content = diary_content_input_edit.value;
        const image = diary_image_input_edit.value;
        const tag = diary_tag_input_edit.value;
        const emotion = diary_emotion_input_edit.value;
        //先創建一個Date實體

        var date = formatDate(new Date(diary_date_edit.value.split('.').join('-')));

        //check date vaild
        if(!isExistDate(diary_date_edit.value)){
          alert("Please enter a vaild datetime!");
          return;
        }

        if (!content) {
            alert("Please enter a content!");
            return;
        }
        
        try {
            diary = editDiaryById(diary.id, { date, content, image, tag, emotion });
            console.log("After edit:", diary);

            //alert("編輯日記成功!");
            modal_edit.style.display = 'none';
            location.reload();
            return;

        } catch (error) {
            alert("Failed to edit diary!");
            return;
        }
      });
      return;
    });
    

    const date = item.querySelector(".diary-date");
    date.innerText = diary.date;
    const content = item.querySelector(".diary-content");
    content.innerText = diary.content;
    const image = item.querySelector(".diary-image");
    image.src = diary.image;
    const tag = item.querySelector(".diary-tag");
    tag.innerText = diary.tag;
    const emotion = item.querySelector(".diary-emotion");
    emotion.innerText = diary.emotion;

    const deleteButton = item.querySelector("button.delete-diary");
    deleteButton.dataset.id = diary.id;
    deleteButton.addEventListener("click", () => {
        deleteDiaryElement(diary.id);
        alert("刪除日記成功!");
        return;
    });
    return item;
}

function isExistDate(dateStr) {

  var dateObj = dateStr.split('.'); // yyyy.mm.dd

  //列出12個月，每月最大日期限制
  var limitInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  var theYear = parseInt(dateObj[0]);
  var theMonth = parseInt(dateObj[1]);
  var theDay = parseInt(dateObj[2]);
  var isLeap = new Date(theYear, 1, 29).getDate() === 29; // 是否為閏年?

  if (isLeap) {
    // 若為閏年，最大日期限制改為 29
    limitInMonth[1] = 29;
  }

  // 比對該日是否超過每個月份最大日期限制
  return theDay <= limitInMonth[theMonth - 1];
}


async function editDiaryElement(id) {
  try {
    await editDiaryById(id);
  } catch (error) {
    alert("Failed to edit diary!");
  } 
  const diary = document.getElementById(id);
  return diary;
}

async function deleteDiaryElement(id) {
  try {
    await deleteDiaryById(id);
  } catch (error) {
    alert("Failed to delete diary!");
  } finally {
    const diary = document.getElementById(id);
    diary.remove();
  }
}


//api連結
async function getDiary() {
    const response = await instance.get("/diarys");
    return response.data;
}


async function createDiary(diary) {
    const response = await instance.post("/diarys", diary);
    console.log(diary);
    return response.data;
}

// eslint-disable-next-line no-unused-vars
async function updateDiaryStatus(id, diary) {
    const response = await instance.put(`/diarys/${id}`, diary);
    return response.data;
}

async function deleteDiaryById(id) {
    try {
        console.log(id);
        const response = await instance.delete(`/diarys/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting diary:', error);
        throw error; // Rethrow the error to handle it further if needed
    }
}
 

async function editDiaryById(id, diary) {
  try {
      console.log(id);
      const response = await instance.patch(`/diarys/${id}`, diary);
      return response.data;
  } catch (error) {
      console.error('Error editing diary:', error);
      throw error; // Rethrow the error to handle it further if needed
  }
}

main();



