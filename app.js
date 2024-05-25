const CHUNK_SIZE = 6000;

const fileInput = document.querySelector('#fileinput');
const scroll = document.querySelector('main');
const container = document.querySelector('#container');
const visibleSlices = [];
let sliceGenerator = undefined;

function* getSlicedFile(file, sliceSize) {
  let begin = 0;
  let end = sliceSize;

  while (end < file.size) {
    yield file.slice(begin, end);
    begin = end;
    end += sliceSize;
  }
}

function updateView() {
  container.innerText = visibleSlices.join('');
}

async function pushSlice(slice) {
  const text = await slice.text();
  visibleSlices.push(text);
  updateView();
}

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];

  sliceGenerator = getSlicedFile(file, CHUNK_SIZE);
  const { value: slice } = sliceGenerator.next();

  pushSlice(slice);
});

scroll.addEventListener('scroll', (e) => {
  scrollBottom = scroll.scrollHeight - (scroll.scrollTop + scroll.clientHeight);

  if (scrollBottom > 100) {
    return;
  }

  const { value: slice } = sliceGenerator.next();
  pushSlice(slice);
})
