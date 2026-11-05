// variables used by scriptable - these must stay at the very top of the file , so do not edit them !


// settings

const eventName = 'goal'
const startDate = new Date( '2026-11-05' )   // set the start date here !

const endDate = new Date( startDate )
endDate.setDate( startDate.getDate() + 89 )

const bgImageUrl  = ''   // no bg image as default ( use url if you want to use one )
const bgColor     = '#ffffff'
const bgOpacity   = 0.5
const filledColor = new Color( '#000000' )
const emptyColor  = new Color( '#000000', 0.3 )

const padding        = 8
const dotSize        = 6
const dotSpacing     = 4
const textSpacing    = 8
const dotShift       = 2
const nameOffset     = dotShift - 2
const daysLeftOffset = 0


// days

const now       = new Date()
const msPerDay  = 86400000
const totalDays = 90

const daysPassed = Math.min( totalDays, Math.max( 0, Math.floor( ( now - startDate ) / msPerDay ) + 1 ) )
const daysLeft   = Math.max( 0, totalDays - daysPassed + 1 )

const widget = new ListWidget()


// background

let bgImage = null

try {
    const request = new Request( bgImageUrl )
    bgImage       = await request.loadImage()
} catch ( e ) {
    console.log( "couldn't load background image" )
}

if ( bgImage ) {
    widget.backgroundImage = bgImage
}

const overlay = new LinearGradient()

overlay.locations = [ 0, 1 ]
overlay.colors    = [
    new Color( bgColor, bgOpacity ),
    new Color( bgColor, bgOpacity )
]

widget.backgroundGradient = overlay


// layout

const widgetWidth = 320
const usableWidth = widgetWidth - ( 2 * padding )
const dotWidth    = dotSize + dotSpacing
const columns     = Math.floor( usableWidth / dotWidth )
const rows        = Math.ceil( totalDays    / columns )

const fontRegular = new Font( 'Menlo', 12 )
const fontBold    = new Font( 'Menlo-Bold', 12 )

widget.setPadding( 12, padding, 12, padding )


// grid of dots ( one per day )

const gridContainer = widget.addStack()
gridContainer.layoutVertically()

const grid = gridContainer.addStack()
grid.layoutVertically()
grid.spacing = dotSpacing

for ( let row = 0 ; row < rows ; row++ ) {

    const rowStack = grid.addStack()
    rowStack.layoutHorizontally()
    rowStack.addSpacer( dotShift )

    for ( let col = 0 ; col < columns ; col++ ) {

        const day = row * columns + col + 1
        if ( day > totalDays ) continue

        const dot     = rowStack.addText( '●' )
        dot.font      = Font.systemFont( dotSize )
        dot.textColor = day <= daysPassed ? filledColor : emptyColor

        if ( col < columns - 1 ) rowStack.addSpacer( dotSpacing )
    }
}

widget.addSpacer( textSpacing )


// footer ( name left , days left right )

const footer = widget.addStack()
footer.layoutHorizontally()

const nameStack = footer.addStack()
nameStack.addSpacer( nameOffset )

const nameText     = nameStack.addText( eventName )
nameText.font      = fontBold
nameText.textColor = filledColor

const leftString = `${ daysLeft } days left`
const leftWidth  = leftString.length * 7.5
const freeSpace  = widgetWidth - ( padding * 2 ) - nameOffset - ( nameText.text.length * 7.5 )
const spacerSize = freeSpace   - leftWidth + daysLeftOffset

footer.addSpacer( spacerSize )

const leftStack    = footer.addStack()
const leftText     = leftStack.addText( leftString )
leftText.font      = fontRegular
leftText.textColor = emptyColor


// show

if ( config.runsInWidget ) {
    Script.setWidget( widget )
} else {
    widget.presentMedium()
}

Script.complete()
