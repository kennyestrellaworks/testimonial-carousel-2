const DOMStrings = {
    testimonialContainer: document.querySelector('.testimonial__container'),
    testimonialSlideContainer: document.querySelector('.testimonial__slide-container'),
    testimonialSlideWrap: document.querySelector('.testimonial__slide-wrap'),
    testimonialCard: '',
    testimonialCardContent: '',
    testimonialCardOwner: '',
    sliderControlContainer: document.querySelector('.slider-control__container'),
    sliderControlRight: document.querySelector('.slider-control__right'),
    sliderControlLeft: document.querySelector('.slider-control__left')
}

const setup = {
    starCount: 5,
    socialPlatforms: [],
    ownerSocialLinkValues: [],
    eventState: '',    
    isSlideButtonsActive: false,  
    slideDivider: 3, // Customizable number to specify how many items wanted to be shown.
    newSlideDivider: 0,
    divider: 0,
    cardWidth: 0,
    cardDisplayed: 0,
    cardTotal: 0,
    isCardSlidAll: false,    
    componentContainer: 1200, // Customizable 'width' which will center the content.
    slideInterval: 0,
    translateX: 0,
    browserWidth: 0,
    defaultQuotient: 0,
    defaultModulu: 0,
    valueTest1: 0,
    valueTest2: 0,
    valueTest3: 0,
}

const cardSlide = {
    // Default slide.
    slideCountAll: 0, // Serves as how many 'slide count' are needed.
    slideCountAllQuotient: 0,
    slideCountAllModulu: 0,
    // Right slide.
    cardSlidRight: 0,
    slideCountRight: 0,
    slideCountRightQuotient: 0,
    slideCountRightModulu: 0,
    // Remaining items after right slide.
    cardSlidRightRemaining: 0,
    slideCountRightRemaining: 0,
    slideCountRightRemainingQuotient: 0,
    slideCountRightRemainingModulu: 0,
    // Left slide.
    cardSlidLeft: 0,
    slideCountLeft: 0,
    slideCountLeftQuotient: 0,
    slideCountLeftModulu: 0,
    // Remaining items after left slide.
    cardSlidLeftRemaining: 0,
    slideCountLeftRemaining: 0,
    slideCountLeftRemainingQuotient: 0,
    slideCountLeftRemainingModulu: 0,
}

const breakpoint = {
    // Setting custom breakpoint values like doing in CSS.
    breakpointItems: [
        {   divider: 3, // Default used.
            viewportPercent: [100, 90, 70, 48],
            itemsToDisplay: [3, 3, 2, 1]  
        },
        {   divider: 4, 
            viewportPercent: [100, 90, 70, 48],
            itemsToDisplay: [4, 3, 2, 1] 
        },
        {   divider: 5, 
            viewportPercent: [100, 90, 80, 70, 48],
            itemsToDisplay: [5, 4, 3, 2, 1] 
        }
    ],
    // Based on default 'setup.componentContainer' & 'breakpoint.breakpoinItems.divider'
    // the items will be [1200, 1080, 840, 576].
    mediaQueryNumber: []
}

class Data {
    // Getting static data from 'data.js' objects.
    static getData() {
        let testimonial_items = data.testimonial_items
        setup.cardTotal = testimonial_items.length
        // Pushing data from 'social_platforms' to 'setup.socialPlatforms'.
        for (let i = 0; i < data.social_platforms.length; i++) {
            setup.socialPlatforms.push(data.social_platforms[i])
        }
        // Destructuring data from 'data.testimonial_items' object.
        testimonial_items = testimonial_items.map(function(testimonial_item) {
            const { id, profile_pic, first_name, last_name, job_position } = testimonial_item.profile_info
            const { linkedin, facebook, twitter, github, dribbble, behance, youtube, instagram } = testimonial_item.social_links
            const testimonial_comment = testimonial_item.testimonial_comment
            return { id, profile_pic, first_name, last_name, job_position,
                linkedin, facebook, twitter, github, dribbble, behance, youtube, instagram,
                testimonial_comment
            }
        })
        return testimonial_items
    }
}

class UI {
    // Receives 'slide button DOM' & classes to be 'removed' or 'added', then enables it.
    static enableButton(buttonElement, removeClass, addClass) {
        buttonElement.classList.remove(removeClass)
        buttonElement.classList.add(addClass)
    }
    // Receives 'slide button DOM' & classes to be 'removed' or 'added', then disables it.
    static disableButton(buttonElement, removeClass, addClass) {        
        buttonElement.classList.remove(removeClass)
        buttonElement.classList.add(addClass)
    }
    static disableEnableSlideButtons() {
        if (cardSlide.cardSlidLeft == (setup.cardTotal - setup.divider)) {
            this.disableButton(DOMStrings.sliderControlLeft, 'slider-control__buttons-active', 'slider-control__buttons-disabled')
        } else {
            this.enableButton(DOMStrings.sliderControlLeft, 'slider-control__buttons-disabled', 'slider-control__buttons-active')
        }
        if (cardSlide.cardSlidRight == setup.cardTotal) {
            this.disableButton(DOMStrings.sliderControlRight, 'slider-control__buttons-active', 'slider-control__buttons-disabled')
        } else {
            this.enableButton(DOMStrings.sliderControlRight, 'slider-control__buttons-disabled', 'slider-control__buttons-active')
        }
    }
    static showOwnerLinks(testimonial_items) {
        let socialLinkValues = []
        // Looping through testimonial_items(JSON file) then checking if current[i]
        // <div class="testimonial-card"> has class equal to current[i] testimonial_items id.
        for (let i = 0; i < testimonial_items.length; i++) {
            if (DOMStrings.testimonialCard[i].classList.contains(testimonial_items[i].id)) {
                socialLinkValues = [
                    testimonial_items[i].linkedin,
                    testimonial_items[i].facebook,
                    testimonial_items[i].twitter,
                    testimonial_items[i].github,
                    testimonial_items[i].dribbble,
                    testimonial_items[i].behance,
                    testimonial_items[i].youtube,
                    testimonial_items[i].instagram
                ]
                // Pushing it to setup.ownerSocialLinkValues property storing values 
                // of testimonial_items(JSON file) social_links.
                setup.ownerSocialLinkValues.push(socialLinkValues)
            } 
        }
        // Incrementing this to get values of each current[i] setup.ownerSocialLinkValues.
        let socialLinkValuesItem = 0
        let notNullIndex = []
        for (let i = 0; i < setup.ownerSocialLinkValues.length; i++) {
            // While socialLinkValuesItem < current[i] setup.ownerSocialLinkValues
            // we check which index is not "" & pushing it to notNullIndex then increment
            // socialLinkValuesItem to move to another index inside current[i] setup.ownerSocialLinkValues.
            while (socialLinkValuesItem < setup.ownerSocialLinkValues[i].length) {
                if (setup.ownerSocialLinkValues[i][socialLinkValuesItem] != "") {                                                            
                    notNullIndex.push(socialLinkValuesItem)                    
                }                
                socialLinkValuesItem++                
            }
            // Traversing from current[i] <div class="testimonial-card__owner"> & its
            // children <div class="testimonial-card__owner-links">.
            let testimonialCardOwnerLinks = DOMStrings.testimonialCardOwner[i].children[3]   
            let testimonialCardOwnerLinksIcon = ''
            let hrefValue = ''
            let targetValue = ''
            let iconAltName = ''
            // Looping through notNullIndex to create the social icons within
            // the current[i] <div class="testimonial-card__owner-links">.
            for (let j = 0; j < notNullIndex.length; j++) {
                // Creating href of <a>.
                hrefValue = setup.ownerSocialLinkValues[i][notNullIndex[j]]
                if (hrefValue == "" || hrefValue == "#") { targetValue = "_self" } 
                else { targetValue = "_blank" }
                // Constructing alt of <img>.
                iconAltName = setup.socialPlatforms[notNullIndex[j]]
                let firstLetter = iconAltName[0].toUpperCase()
                let firstLetterRemoved = iconAltName.slice(1)
                let iconAltNameConstruct = firstLetter + firstLetterRemoved
                // Creating HTML inside current[i] <div class="testimonial-card__owner-links">.
                testimonialCardOwnerLinksIcon += `
                <a href="${setup.ownerSocialLinkValues[i][notNullIndex[j]]}" target="${targetValue}" class="testimonial-card__owner-links--icon">
                    <img src="images/${setup.socialPlatforms[notNullIndex[j]]}-icon.svg" alt="${testimonial_items[i].first_name} ${testimonial_items[i].last_name} ${iconAltNameConstruct}">
                </a>
                `
            }
            testimonialCardOwnerLinks.innerHTML = testimonialCardOwnerLinksIcon            
            socialLinkValuesItem = 0
            notNullIndex = []
        }
    }
    static showTestimonialRating(testimonial_items) {  
        for (let i = 0; i < DOMStrings.testimonialCard.length; i++) {
            if (DOMStrings.testimonialCard[i].classList.contains(testimonial_items[i].id)) {
                let testimonialCardOwnerRating = DOMStrings.testimonialCard[i].children[0].children[1]
                let testimonialCardOwnerRatingIcons = ''
                for (let j = 0; j < setup.starCount; j++) {
                    testimonialCardOwnerRatingIcons += `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19">
                        <path d="M12,17.27,18.18,21l-1.64-7.03L22,9.24l-7.19-.61L12,2,9.19,8.63,2,9.24l5.46,4.73L5.82,21Z" transform="translate(-2 -2)"/>
                    </svg>
                    `
                }
                testimonialCardOwnerRating.innerHTML = testimonialCardOwnerRatingIcons
            }
        }
    }
    static showTestimonial(testimonial_items) {
        let testimonialHTML = ''
        for (let i = 0; i < testimonial_items.length; i++) {
            testimonialHTML += `
            <div class="testimonial-card__wrap">
                <div class="testimonial-card ${testimonial_items[i].id}">
                    <div class="testimonial-card__content">                                        
                        <div class="testimonial-card__paragraph">
                            <p>${testimonial_items[i].testimonial_comment}</p>
                        </div>
                        <div class="testimonial-card__owner--rating">
                        </div>
                        <div class="testimonial-card__owner">
                            <img class="testimonial-card__owner--picture" src="${testimonial_items[i].profile_pic}" alt="${testimonial_items[i].first_name} ${testimonial_items[i].last_name}">
                            <h2 class="testimonial-card__owner--name">${testimonial_items[i].first_name} ${testimonial_items[i].last_name}</h2>
                            <h4 class="testimonial-card__owner--job">${testimonial_items[i].job_position}</h4>
                            <div class="testimonial-card__owner-links">                            
                            </div>
                        </div>                                    
                    </div>                                    
                </div>
            </div>
            `
        }        
        DOMStrings.testimonialSlideContainer.innerHTML = testimonialHTML
        DOMStrings.testimonialCard = document.querySelectorAll('.testimonial-card')
        DOMStrings.testimonialCardContent = document.querySelectorAll('.testimonial-card__content')
        DOMStrings.testimonialCardOwner = document.querySelectorAll('.testimonial-card__owner')
    }       
}

class Card {
    static makeCardItemWidth(elementWidth, itemsToDisplay) {
        setup.cardWidth = (elementWidth / itemsToDisplay) / 10
        for (let i = 0; i < DOMStrings.testimonialCard.length; i++) {
            DOMStrings.testimonialCard[i].style.width = `${setup.cardWidth}rem`
        }
    }
    // Setting up 'width' for each card items, <div class="testimonial-card">.
    static doCardItemWidth() {
        // When 'setup.browserWidth >= setup.componentContainer' this block performs
        // 'this.makeCardItemWidth(setup.componentContainer, setup.slideDivider)'.
        if (setup.browserWidth >= setup.componentContainer) {
            setup.cardDisplayed = setup.slideDivider
            this.makeCardItemWidth(setup.componentContainer, setup.slideDivider)
        } else {
            // When 'setup.browserWidth < setup.componentContainer' this block of code performs
            // iterations & comparison.
            let counter = 0 // Used to count iteration.
            let limit = 0 // Used to get the next item of 'counter' inside 'breakpoint.mediaQueryNumber'
            let breakpointItems = breakpoint.breakpointItems
            // Using 'counter' to do iteration where it ends when it's less than 'breakpoint.mediaQueryNumber.length'.
            while (counter < breakpoint.mediaQueryNumber.length) {
                // Checking if 'counter' is not equal to 'breakpoint.mediaQueryNumber.length - 1'.
                if (counter != (breakpoint.mediaQueryNumber.length - 1)) {
                    // If 'true', 'limit' gets the value within 'breakpoint.mediaQueryNumber' using the 'counter + 1' as index.
                    limit = breakpoint.mediaQueryNumber[counter + 1]
                } else { limit = 0 } // If 'false', 'limit' becomes 0.
                // Checking if 'setup.browserWidth' is within range.
                // Example test data.
                // 1 counter = 0
                // 2 mediaQueryNumber = [1200, 1080, 840, 576]
                // 3 setup.browserWidth = 800
                // if (800 <= 1200 && 800 > 1080) which is 'false' & when the condition becomes 'true'
                // the values are stored to some properties within 'setup' object then perform
                // 'this.makeCardItemWidth(setup.browserWidth, setup.newSlideDivider)'.
                if (setup.browserWidth <= breakpoint.mediaQueryNumber[counter] && setup.browserWidth > limit) {
                    for (let i = 0; i < breakpointItems.length; i++) {
                        if (setup.slideDivider == breakpointItems[i].divider) {
                            setup.newSlideDivider = breakpointItems[i].itemsToDisplay[counter]
                            setup.cardDisplayed = setup.newSlideDivider
                            this.makeCardItemWidth(setup.browserWidth, setup.newSlideDivider)
                        }
                    }
                }               
                counter++
            }
        }
    }
    // Setting up 'width' for <div class="testimonial__container">.
    static doContainerWidth() {
        if (setup.browserWidth >= setup.componentContainer) {
            DOMStrings.testimonialContainer.style.width = `${setup.componentContainer / 10}rem`
        } else {
            DOMStrings.testimonialContainer.style.width = `${setup.browserWidth / 10}rem`
        }
    }
    // Process of making numbers to represent 'media queries'.
    static doBreakpoint() {
        let breakpointItems = breakpoint.breakpointItems
        let numberOfPercent = 0
        let viewportNumber = 0
        // Looping through 'breakpointItems' array within 'breakpoint' object.
        for (let i = 0; i < breakpointItems.length; i++) {
            // 2 Get the 'breakpointItems[i]' that's equal to 'setup.slideDivider'.       
            if (setup.slideDivider == breakpointItems[i].divider) {
                // Looping through 'breakpointItems[i].viewportPercent' array where each item
                // represents a percentage then using each item to convert number equivalent
                // from 'setup.componentContainer'. These numbers are pushed to 'mediaQueryNumber'
                // array within 'breakpoint' object.
                for (let j = 0; j < breakpointItems[i].viewportPercent.length; j++) {
                    viewportNumber = breakpointItems[i].viewportPercent[j]
                    numberOfPercent = (viewportNumber * setup.componentContainer) / 100
                    breakpoint.mediaQueryNumber.push(numberOfPercent)
                }
            }
        }
    }
    // Getting 'window.innerWidth'.
    static doBrowserWidth() {
        setup.browserWidth = window.innerWidth
    }
}

// Start class Slide.
class Slide {
    // This block performs the 'translation' by adding inline CSS rule to the 'DOMStrings.testimonialSlideWrap'
    // which is the '<div class="testimonial__slide-wrap">'.
    static performTranslation() {
        DOMStrings.testimonialSlideWrap.style.transform = `translateX(${setup.slideInterval * (-1)}rem)`
        setup.translateX = setup.slideInterval * (-1) // Just for tracing actual value.
    }
    // This block receives 'translation' which is the direction, for now only 'translateX' in the
    // future there might be 'translateY'. The 'setup.slideInterval' refers to the compution needed
    // depending on the current 'setup.eventState'.
    static processTranslation(translation) {
        // When 'setup.eventState' is either 'right slide' or 'left side', this block performs
        // a standard 'translation'.
        if (setup.eventState == 'right slide' || setup.eventState == 'left slide') {
            if (translation == 'translateX') {
                this.performTranslation()
            }
        }
        // Code block that enables 'translationX' during 'browser resize'.
        if (setup.eventState == 'browser resize') {
            if (translation == 'translateX') {
                // if (setup.isSlideButtonsActive == true) {
                //     setup.slideInterval = (setup.cardWidth * cardSlide.cardSlidRight) - (setup.cardWidth * setup.newSlideDivider)                    
                //     this.performTranslation()
                // }
                setup.slideInterval = (setup.cardWidth * cardSlide.cardSlidRight) - (setup.cardWidth * setup.newSlideDivider)                    
                this.performTranslation()
            }            
        } 
    }
    // Preparing 'slide' common values.
    static prepareSlide() {
        // In 'page load', we use 'cardSlide.cardSlidRight' to create 
        // a default starting 'cards slid'.
        // Preparing 'setup.divider' & 'setup.slideInterval'.
        if (setup.browserWidth >= setup.componentContainer) {
            setup.divider = setup.slideDivider
            setup.slideInterval = setup.componentContainer / 10
        } else {
            setup.divider = setup.newSlideDivider            
            setup.slideInterval = setup.browserWidth / 10
        } 
    }
    // Identify remaining items after the card slid.
    static doCardSlidRemaining() {
        cardSlide.cardSlidRightRemaining = Slide.computeDifference(setup.cardTotal, cardSlide.cardSlidRight)
        cardSlide.cardSlidLeftRemaining = Slide.computeDifference(setup.cardTotal, cardSlide.cardSlidLeft)
    }
    // Making values for the 'slide count left'.
    static doSlideCountLeft() {        
        cardSlide.slideCountLeft = Slide.computeSlideCount(cardSlide.cardSlidLeft, setup.divider) 
        cardSlide.slideCountLeftQuotient = Slide.computeQuotient(cardSlide.cardSlidLeft, setup.divider)
        cardSlide.slideCountLeftModulu = Slide.computeModulu(cardSlide.cardSlidLeft, setup.divider)
    }    
    // Making values for the remaining items of 'slide count left'.
    static doSlideCountLeftRemaining() {
        cardSlide.slideCountLeftRemaining = Slide.computeSlideCount(cardSlide.cardSlidLeftRemaining, setup.divider) 
        cardSlide.slideCountLeftRemainingQuotient = Slide.computeQuotient(cardSlide.cardSlidLeftRemaining, setup.divider)
        cardSlide.slideCountLeftRemainingModulu = Slide.computeModulu(cardSlide.cardSlidLeftRemaining, setup.divider)
    }    
    // Making values for the remaining items of 'slide count right'.
    static doSlideCountRightRemaining() {
        cardSlide.slideCountRightRemaining = Slide.computeSlideCount(cardSlide.cardSlidRightRemaining, setup.divider) 
        cardSlide.slideCountRightRemainingQuotient = Slide.computeQuotient(cardSlide.cardSlidRightRemaining, setup.divider)
        cardSlide.slideCountRightRemainingModulu = Slide.computeModulu(cardSlide.cardSlidRightRemaining, setup.divider)
    }
    // Making values for the 'slide count right'.
    static doSlideCountRight() {
        cardSlide.slideCountRight = Slide.computeSlideCount(cardSlide.cardSlidRight, setup.divider) 
        cardSlide.slideCountRightQuotient = Slide.computeQuotient(cardSlide.cardSlidRight, setup.divider)
        cardSlide.slideCountRightModulu = Slide.computeModulu(cardSlide.cardSlidRight, setup.divider)
    }
    // Making values for the 'slide' by default.
    static doSlideCountAll() {        
        cardSlide.slideCountAll = Slide.computeSlideCount(setup.cardTotal, setup.divider) 
        cardSlide.slideCountAllQuotient = Slide.computeQuotient(setup.cardTotal, setup.divider)
        cardSlide.slideCountAllModulu = Slide.computeModulu(setup.cardTotal, setup.divider)
    }
    // Setting 'cardSlide.slideCountRight' values.
    static computeSlideCount(dividend, divider) {        
        let slideQuotient = 0
        let slideModulu = 0
        let extraCount = 0
        slideQuotient = this.computeQuotient(dividend, divider)
        slideModulu = this.computeModulu(dividend, divider)
        if (slideModulu != 0) { extraCount = 1 }
        return slideQuotient + extraCount
    }
    // Peform standard addition.
    static computeSum(addend1, addend2) {
        return addend1 + addend2
    }
    // Perform standard subtraction.
    static computeDifference(minuend, subtrahend) {
        return minuend - subtrahend
    }
    // Perform standard division.
    static computeQuotient(dividend, divisor) {
        return Math.floor(dividend / divisor)
    }
    // Perform standard modulu.
    static computeModulu(dividend, divider) {
        return dividend % divider
    }        
} // End class Slide.

// Start right slide.
DOMStrings.sliderControlRight.addEventListener('click', function() {
    setup.eventState = 'right slide'    
    setup.isSlideButtonsActive = true
    
    if (setup.isCardSlidAll == false) {
        if (cardSlide.slideCountRight < cardSlide.slideCountAllQuotient) {
            setup.slideInterval = cardSlide.cardSlidRight * setup.cardWidth
            Slide.processTranslation('translateX')
            cardSlide.cardSlidRight += setup.divider
            if (cardSlide.cardSlidLeft != 0) { cardSlide.cardSlidLeft -= setup.divider }
            Slide.doSlideCountRight()
            Slide.doSlideCountLeft()
            Slide.doCardSlidRemaining()
            Slide.doSlideCountRightRemaining()
            Slide.doSlideCountLeftRemaining()           
            traceValues('RIGHT SLIDE')
        } else if (cardSlide.slideCountRight == cardSlide.slideCountAllQuotient) {    
            let extraSlide = 0
            extraSlide = setup.cardTotal - cardSlide.cardSlidRight
            setup.slideInterval = setup.slideInterval + (setup.cardWidth * extraSlide)        
            Slide.processTranslation('translateX')
            cardSlide.cardSlidRight += extraSlide
            if (setup.defaultModulu != 0) { cardSlide.cardSlidLeft -= setup.divider }
            cardSlide.cardSlidLeft = setup.divider
            Slide.doSlideCountRight()
            Slide.doSlideCountLeft()
            Slide.doCardSlidRemaining()
            Slide.doSlideCountRightRemaining()
            Slide.doSlideCountLeftRemaining()
            setup.isCardSlidAll = true
            traceValues('RIGHT SLIDE')
        }
    } else {
        if (cardSlide.slideCountLeft != 1) {
            setup.slideInterval = cardSlide.cardSlidRight * setup.cardWidth
            Slide.processTranslation('translateX')
            cardSlide.cardSlidRight += setup.divider
            if (setup.defaultModulu != 0) { cardSlide.cardSlidLeft -= setup.divider }
            Slide.doSlideCountRight()
            Slide.doSlideCountLeft()
            Slide.doCardSlidRemaining()
            Slide.doSlideCountRightRemaining()
            Slide.doSlideCountLeftRemaining()
            traceValues('RIGHT SLIDE')
        }        
        if (cardSlide.cardSlidRight == setup.cardTotal) { setup.isCardSlidAll = true }
    }
    UI.disableEnableSlideButtons()

}) // End right slide.

// Start left slide.
DOMStrings.sliderControlLeft.addEventListener('click', function() {
    setup.eventState = 'left slide'
    setup.isSlideButtonsActive = true
    
    if (setup.isCardSlidAll == true) {
        if (cardSlide.slideCountLeft < cardSlide.slideCountAllQuotient) {
            setup.valueTest1 = '1'
            setup.slideInterval = setup.slideInterval - (setup.cardWidth * setup.divider)
            Slide.processTranslation('translateX')
            cardSlide.cardSlidLeft += setup.divider
            if (cardSlide.cardSlidRight != 0) { cardSlide.cardSlidRight -= setup.divider }
            Slide.doSlideCountRight()
            Slide.doSlideCountLeft()
            Slide.doCardSlidRemaining()
            Slide.doSlideCountRightRemaining()
            Slide.doSlideCountLeftRemaining()
            traceValues('LEFT SLIDE')
        } else if (cardSlide.slideCountLeft == cardSlide.slideCountAllQuotient) {
            setup.valueTest1 = '2'
            let extraSlide = 0
            extraSlide = setup.cardTotal - cardSlide.cardSlidLeft
            setup.slideInterval = setup.slideInterval - (setup.cardWidth * extraSlide)
            Slide.processTranslation('translateX')
            cardSlide.cardSlidLeft += extraSlide
            if (cardSlide.cardSlidRight != 0) { cardSlide.cardSlidRight -= setup.divider }
            cardSlide.cardSlidRight = setup.divider
            Slide.doSlideCountRight()
            Slide.doSlideCountLeft()
            Slide.doCardSlidRemaining()
            Slide.doSlideCountRightRemaining()
            Slide.doSlideCountLeftRemaining()
            if (cardSlide.cardSlidLeft == setup.cardTotal) { cardSlide.cardSlidLeft -= setup.divider }
            setup.isCardSlidAll = false
            traceValues('LEFT SLIDE')
        }
    } else {      
        if (cardSlide.slideCountRight != 1) { 
            if (cardSlide.cardSlidLeftRemaining < setup.slideDivider) {
                setup.valueTest1 = '1 it reached here'
                setup.slideInterval = setup.slideInterval - (setup.cardWidth * cardSlide.slideCountAllModulu)
                Slide.processTranslation('translateX')
                Slide.doSlideCountRight()
                Slide.doSlideCountLeft()
                Slide.doCardSlidRemaining()
                Slide.doSlideCountRightRemaining()
                Slide.doSlideCountLeftRemaining()
                if (cardSlide.cardSlidLeft == setup.cardTotal) { cardSlide.cardSlidLeft -= setup.divider }
                traceValues('LEFT SLIDE') 
            } else {
                setup.valueTest1 = '2 it reached here'
                setup.slideInterval = setup.slideInterval - (setup.cardWidth * setup.divider)  
                Slide.processTranslation('translateX')          
                cardSlide.cardSlidLeft += setup.divider
                if (cardSlide.cardSlidRight != 0) { cardSlide.cardSlidRight -= setup.divider }
                Slide.doSlideCountRight()
                Slide.doSlideCountLeft()
                Slide.doCardSlidRemaining()
                Slide.doSlideCountRightRemaining()
                Slide.doSlideCountLeftRemaining()
                traceValues('LEFT SLIDE') 
            }            
        }        
        if (cardSlide.cardSlidLeft == setup.cardTotal) { setup.isCardSlidAll = false }
    }
    UI.disableEnableSlideButtons()

}) // End left slide.

// Start window resize.
window.addEventListener('resize', function() {
    setup.eventState = 'browser resize'    
    // Getting 'window.innerWidth'.
    Card.doBrowserWidth()
    // Make container width, DOMStrings.testimonialContainer'.
    Card.doContainerWidth()
    // Process 'setup.cardWidth'.
    Card.doCardItemWidth()
    // Prepare the 'slide'.
    Slide.prepareSlide()
    // Making values for the 'slide' by default.
    Slide.doSlideCountAll()
    // When 'slide buttons' are not clicked.
    if (setup.isSlideButtonsActive == false) { 
        // Initialize 'cardSlide.cardSlidRight' & 'cardSlide.cardSlidLeft.
        cardSlide.cardSlidRight = setup.divider
        cardSlide.cardSlidLeft = setup.cardTotal 
        // Making values for the 'slide count right'.
        //Slide.doCardSlidRemaining()
        Slide.doSlideCountRight()
        Slide.doSlideCountRightRemaining()
        Slide.doSlideCountLeft()
        Slide.doSlideCountLeftRemaining()
    }
    // Some problems on the placement of 'cards displayed'.
    if (setup.isSlideButtonsActive == true) {
        if (setup.cardDisplayed < setup.slideDivider) {
            cardSlide.cardSlidLeft = setup.cardTotal - cardSlide.cardSlidRight
            if (cardSlide.cardSlidRight < setup.slideDivider) {
                cardSlide.cardSlidRight = (setup.slideDivider - cardSlide.cardSlidRight) + cardSlide.cardSlidRight
                cardSlide.cardSlidLeft -= setup.divider
                setup.valueTest1 = cardSlide.cardSlidLeft
            }             
        }
        setup.isCardSlidAll = false          
        // Identify remaining items after the card slid.
        Slide.doCardSlidRemaining()
        // Making values for the 'slide' by default.
        Slide.doSlideCountAll()
        // Making values for the 'slide count right'.
        Slide.doSlideCountRight()
        Slide.doSlideCountRightRemaining()
        // Making values for the 'slide count left'.
        Slide.doSlideCountLeft()
        Slide.doSlideCountLeftRemaining()       
    }     
    // Process 'translation'.
    Slide.processTranslation('translateX')
    UI.disableEnableSlideButtons()

    traceValues('BROWSER RESIZE')
}) // End window resize.

// Start page load.
document.addEventListener('DOMContentLoaded', function() {    
    setup.eventState = 'page load'
    // Getting data from 'data.js object'. 
    const data = Data.getData() 
    // Displaying testimonial items.           
    UI.showTestimonial(data)
    // Displaying testimonial ratings.
    UI.showTestimonialRating(data)
    // Displaying testimonial person social links.
    UI.showOwnerLinks(data)          
    // Getting 'window.innerWidth'.
    Card.doBrowserWidth()
    // Making numbers that'll be stored as items in 'breakpoint.mediaQueryNumber' array
    // from 'breakpoint' object.
    Card.doBreakpoint()
    // Make container width, DOMStrings.testimonialContainer'.
    Card.doContainerWidth()
    // Process 'setup.cardWidth'.
    Card.doCardItemWidth()
    // Default 'quotient' & 'modulu' based on the given 'setup.cardTotal' & 'setup.slideDivider'.
    setup.defaultQuotient = Slide.computeQuotient(setup.cardTotal, setup.slideDivider)
    setup.defaultModulu = Slide.computeModulu(setup.cardTotal, setup.slideDivider)
    // Prepare the 'slide'.
    Slide.prepareSlide()
    // Initialize 'cardSlide.cardSlidRight' & 'cardSlide.cardSlidLeft.
    cardSlide.cardSlidRight = setup.divider
    cardSlide.cardSlidLeft = setup.cardTotal - setup.divider
    //cardSlide.cardSlidLeft = setup.cardTotal 
    // Identify remaining items after the card slid.
    Slide.doCardSlidRemaining()
    // Making values for the 'slide' by default.
    Slide.doSlideCountAll()
    // Making values for the 'slide count right'.
    Slide.doSlideCountRight()
    Slide.doSlideCountRightRemaining()
    // Making values for the 'slide count left'.
    Slide.doSlideCountLeft()
    Slide.doSlideCountLeftRemaining()   
    // Disabling 'left slide' button & enabling 'right slide' button.
    UI.disableEnableSlideButtons()   
    
    traceValues('PAGE LOAD')  
}) // End page load.

const traceValues = function(element) {
    console.log('====================')
    console.log(`${element}, defaultQuotient : ${setup.defaultQuotient}, defaultModulu : ${setup.defaultModulu}`)
    console.log(`eventState : ${setup.eventState}, cardTotal : ${setup.cardTotal}`)
    console.log(`divider : ${setup.divider}, newSlideDivider : ${setup.newSlideDivider}, slideDivider : ${setup.slideDivider}`)
    console.log(`browserWidth : ${setup.browserWidth}, componentContainer : ${setup.componentContainer}px, slideInterval : ${setup.slideInterval}rem`)
    console.log(`isCardSlidAll : ${setup.isCardSlidAll}, cardDisplayed: ${setup.cardDisplayed}, isSlideButtonsActive : ${setup.isSlideButtonsActive}`) 
    console.log('*** SLIDE COUNT ALL') 
    console.log(`slideCountAll : ${cardSlide.slideCountAll}`) 
    console.log(`slideCountAllQuotient : ${cardSlide.slideCountAllQuotient}, slideCountAllModulu : ${cardSlide.slideCountAllModulu}`)
    console.log('*** CARD SLID RIGHT') 
    console.log(`cardSlidRight : ${cardSlide.cardSlidRight}`) 
    console.log(`slideCountRight : ${cardSlide.slideCountRight} (${cardSlide.cardSlidRight} / ${setup.divider})`) 
    console.log(`slideCountRightQuotient : ${cardSlide.slideCountRightQuotient}, slideCountRightModulu : ${cardSlide.slideCountRightModulu}`)
    console.log('*** CARD SLID RIGHT REMAINING') 
    console.log(`cardSlidRightRemaining : ${cardSlide.cardSlidRightRemaining}`) 
    console.log(`slideCountRightRemaining : ${cardSlide.slideCountRightRemaining} (${cardSlide.cardSlidRightRemaining} / ${setup.divider})`) 
    console.log(`slideCountRightRemainingQuotient : ${cardSlide.slideCountRightRemainingQuotient}, slideCountRightRemainingModulu : ${cardSlide.slideCountRightRemainingModulu}`) 
    console.log('*** CARD SLID LEFT') 
    console.log(`cardSlidLeft : ${cardSlide.cardSlidLeft}`) 
    console.log(`slideCountLeft : ${cardSlide.slideCountLeft} (${cardSlide.cardSlidLeft} / ${setup.divider})`) 
    console.log(`slideCountLeftQuotient : ${cardSlide.slideCountLeftQuotient}, slideCountLeftModulu : ${cardSlide.slideCountLeftModulu}`)
    console.log('*** CARD SLID LEFT REMAINING') 
    console.log(`cardSlidLeftRemaining : ${cardSlide.cardSlidLeftRemaining}`) 
    console.log(`slideCountLeftRemaining : ${cardSlide.slideCountLeftRemaining} (${cardSlide.cardSlidLeftRemaining} / ${setup.divider})`) 
    console.log(`slideCountLeftRemainingQuotient : ${cardSlide.slideCountLeftRemainingQuotient}, slideCountLeftRemainingModulu : ${cardSlide.slideCountLeftRemainingModulu}`) 
    console.log('*** VALUE TESTING')
    console.log(`valueTest1 : ${setup.valueTest1}`) 
    console.log(`valueTest2 : ${setup.valueTest2}`)
    console.log(`valueTest3 : ${setup.valueTest3}`)
    console.log('====================')
}
