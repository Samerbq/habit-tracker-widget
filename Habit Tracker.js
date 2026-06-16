// variables used by Scriptable - these must be at the very top of the file so do not edit them !


const EVENT_NAME = "goal"

const START_DATE = new Date("2026-06-17") // set the start date here ! 


const END_DATE = new Date(START_DATE)
END_DATE.setDate(START_DATE.getDate() + 89)

const BG_IMAGE_URL = "" // no background image by default - set a url to use one : ) 
const BG_COLOR = "#ffffff"
const BG_OVERLAY_OPACITY = 0.5
const COLOR_FILLED = new Color("#000000")
const COLOR_UNFILLED = new Color("#000000", 0.3)

const PADDING = 8
const CIRCLE_SIZE = 6
const CIRCLE_SPACING = 4
const TEXT_SPACING = 8
const DOT_SHIFT_LEFT = 2
const YEAR_OFFSET = DOT_SHIFT_LEFT - 2
const DAYS_LEFT_OFFSET = 0

const NOW = new Date()
const MS_PER_DAY = 86400000
const DAYS_TOTAL = 90


const DAYS_SINCE_START = Math.min(DAYS_TOTAL, Math.max(0, Math.floor((NOW - START_DATE) / MS_PER_DAY) + 1))
const DAYS_UNTIL_END = Math.max(0, DAYS_TOTAL - DAYS_SINCE_START + 1)

const widget = new ListWidget()


let bgImage = null
try {
  const req = new Request(BG_IMAGE_URL)
  bgImage = await req.loadImage()
} catch (e) {
  console.log("Couldn't load background image")
}
if (bgImage) {
  widget.backgroundImage = bgImage
}


const overlay = new LinearGradient()
overlay.locations = [0, 1]
overlay.colors = [
  new Color(BG_COLOR, BG_OVERLAY_OPACITY),
  new Color(BG_COLOR, BG_OVERLAY_OPACITY)
]
widget.backgroundGradient = overlay


const WIDGET_WIDTH = 320
const AVAILABLE_WIDTH = WIDGET_WIDTH - (2 * PADDING)
const TOTAL_CIRCLE_WIDTH = CIRCLE_SIZE + CIRCLE_SPACING
const COLUMNS = Math.floor(AVAILABLE_WIDTH / TOTAL_CIRCLE_WIDTH)
const ROWS = Math.ceil(DAYS_TOTAL / COLUMNS)

const MENLO_REGULAR = new Font("Menlo", 12)
const MENLO_BOLD = new Font("Menlo-Bold", 12)

widget.setPadding(12, PADDING, 12, PADDING)

// Build grid
const gridContainer = widget.addStack()
gridContainer.layoutVertically()

const gridStack = gridContainer.addStack()
gridStack.layoutVertically()
gridStack.spacing = CIRCLE_SPACING

for (let row = 0; row < ROWS; row++) {
  const rowStack = gridStack.addStack()
  rowStack.layoutHorizontally()
  rowStack.addSpacer(DOT_SHIFT_LEFT)

  for (let col = 0; col < COLUMNS; col++) {
    const day = row * COLUMNS + col + 1
    if (day > DAYS_TOTAL) continue

    const circle = rowStack.addText("●")
    circle.font = Font.systemFont(CIRCLE_SIZE);
    circle.textColor = day <= DAYS_SINCE_START ? COLOR_FILLED : COLOR_UNFILLED

    if (col < COLUMNS - 1) rowStack.addSpacer(CIRCLE_SPACING)
  }
}

widget.addSpacer(TEXT_SPACING)


const footer = widget.addStack()
footer.layoutHorizontally()

const eventStack = footer.addStack()
eventStack.addSpacer(YEAR_OFFSET)
const eventText = eventStack.addText(EVENT_NAME)
eventText.font = MENLO_BOLD
eventText.textColor = COLOR_FILLED

const daysText = `${DAYS_UNTIL_END} days left`
const textWidth = daysText.length * 7.5
const availableSpace = WIDGET_WIDTH - (PADDING * 2) - YEAR_OFFSET - (eventText.text.length * 7.5)
const spacerLength = availableSpace - textWidth + DAYS_LEFT_OFFSET

footer.addSpacer(spacerLength)

const daysTextStack = footer.addStack()
const daysLeft = daysTextStack.addText(daysText)
daysLeft.font = MENLO_REGULAR
daysLeft.textColor = COLOR_UNFILLED


if (config.runsInWidget) {
  Script.setWidget(widget)
} else {
  widget.presentMedium()
}
Script.complete()