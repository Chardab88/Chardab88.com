const image = document.getElementById("driverImage");
const rightArrow = document.getElementById("rightArrow");
const leftArrow = document.getElementById("leftArrow");
const wall1 = document.getElementById("wall1");
function getVisibleContainers() {
    return [...document.querySelectorAll(".container")]
        .filter(container => container.offsetParent !== null);
}


const wallImages = [
  "richard petty.png","david pearson.png","jeff gordon.png","bobby allison.png","darrell waltrip.png","cale yarborough.png",
  "jimmie johnson.png","dale sr.png","denny hamlin.png","kyle busch.png","kevin harvick.png","rusty wallace.png","lee petty.png",
  "ned jarrett.png","junior johnson.png","tony stewart.png","herbthomas.png","buck baker.png","bill elliott.png","mark martin.png",
  "tim flock.png","matt kenseth.png","bobbyisaac.png","joeylogano.png","brad keselowski.png","kurtbusch.png","martin truexjr.png","fireball roberts.png",
  "dalejarrett.png","kyle larson.png","rex white.png","carl edwards.png","fredlorenzen.png","dalejr.png","jim paschal.png","joe weatherly.png", 
  "ricky rudd.png","chase elliott.png","terry labonte.png","jack smith.png", "benny parsons.png","bobby labonte.png","jeff burton.png","speedy thompson.png",
  "fonty flock.png","buddy baker.png","davey allison.png",  "greg biffle.png","neil bonnett.png","harry gant.png","geoff bodine.png","ryan newman.png","kasey kahne.png",
  "ryan blaney.png","curtis turner.png","marvin panch.png", "william byron.png","ernie irvan.png","dick hutcherson.png","leeroy yarbrough.png","dick rathman.png",
  "tim richmond.png","christopher bell.png","donnieallison.png", "tyler reddick.png","sterling marlin.png","clint bowyer.png","bob welborn.png","cotton owens.png",
  "paul goldsmith.png","kyle petty.png","alex bowman.png", "svg.png","darel dienger.png","jim reed.png","marshall teague.png","ajfoyt.png","jamie mcmurray.png",
  "chris buescher.png","ross chastain.png",
  
  "austin dillon.png", "ralph moody.png","dan gurney.png","tiny lund.png","dave marcis.png","alan kulwicki.png",
  "ward burton.png","jeremy mayfield.png","chase briscoe.png","bob flock.png", "hershel mcgriff.png","eddie pagan.png","lloyd dane.png","eddie gray.png",
  "nelson stacy.png","glenn wood.png","billy wade.png","parenlli jones.png","pete hamilton.png", "charlie glotzbach.png","ken schrader.png","morgan shepherd.png",
  "bobby hamilton.png","michael waltrip.png","joe nemechek.png","rickystenhousejr.png","dick linder.png", "frank mundy.png","bill blaier.png","gwyn staley.png",
  "robby gordon.png","elliott sadler.png","brian vickers.png","aric almirola.png","erik jones.png","aj allmendinger.png", "austin cindric.png","bubba wallace.png","daniel suarez.png",
  "red byron.png","gober sosebee.png","al keller.png","danny letner.png","billy myers.png","tom pistone.png","marvin porter.png", "joe lee johnson.png",
  "john beauchamp.png","emanuel zervakis.png","bobby johns.png","jimmy pardue.png","elmo langley.png","ray elder.png","james hylton.png","derrike cope.png",
 "jimmy spencer.png","john andretti.png","steve park.png","ricky craven.png","david reutimann.png","juan pablo montoya.png","marcos ambrose.png","david ragan.png",
 "michael mcdowell.png","jim roper.png","jack white.png","harold kite.png","bill rexford.png","jimmy florian.png","johnny mantz.png","leon sales.png",
 "lloyd moore.png","lou figaro.png","tommy thompson.png","neil cole.png","marvin burke.png","danny weinberg.png","bill norton.png","buddy shuman.png","donald thomas.png",

 "dick passwater.png","john soares.png","norm nelson.png","chuck stevenson.png","joe eubanks.png","royce hagerty.png","art watts.png","bill amick.png","danny graves.png",
 "frankie schnieder.png","shorty rollins.png","johnny kieper.png","john rostek.png","jim cook.png","bob burdick.png","johnny allen.png","larry frank.png","johnny rutherford.png",
 "wendell scott.png","earl balmer.png","jim hurtubise.png","sam mcquagg.png","paul lewis.png","mario andretti.png","richard brickhouse.png","mark donohue.png","dick brooks.png",
 "earl ross.png","lennie pond.png","ron bouchard.png","jody ridley.png","greg sacks.png","bobby hillin.png","lake speed.png","phil parsons.png","brett bodine.png","jerry nadeau.png",
 "casey mears.png","johnny benson.png","trevor bayne.png","regan smith.png","paul menard.png","justin haley.png","cole custer.png","harrison burton.png","josh berry.png",
 "ty gibbs.png","carson hocevar.png","corey heim.png","gc spencer.png","neil castles.png","ted musgrave.png","possum jones.png","john sears.png","joe ruttman.png","kenny wallace.png",
 "matt dibendetto.png","jim massey.png","ralph earnhardt.png","jt putney.png","bud moore.png","wally dallenbach.png","hut stricklin.png","david gilliland.png","chuck mahoney.png",
 "banjo matthews.png","larry thomas.png","stick elliott.png","jim vandiver.png","roger mcclusky.png","ramo stott.png","cecil gordon.png","joe millikan.png","butch lindley.png",
 "rick wilson.png","rick mast.png","chad little.png","mike skinner.png","robert pressley.png","mike wallace.png","jeff green.png",
 
 "jj yeley.png","brian scott.png","scott pruett.png","scott riggs.png","zane smith.png","todd gilliland.png","dick trickle.png","doug cooper.png","dave blaney.png",
 "bill dennis.png","richard childress.png","buddy arrington.png","ryan preece.png","bub king.png",
 "maurice petty.png","rene charland.png","jd mcduffie.png","skip manning.png","todd bodine.png","kenny irwin.png","casey atwood.png","scott wimmer.png","boris said.png","reed sorenson.png",
 "ty dillon.png","noah gragson.png","corey lajoie.png","jimmy thompson.png","herman beam.png","larry manning.png","al unser.png","bobby unser.png","steve grissom.png","landon cassill.png","John H. Nemechek.png",
 "ron hornadaysr.png","john soaresjr.png","bill schmitt.png","tighe scott.png","dk ulrich.png","rich bickle.png","pj jones.png","mike bliss.png","brendan gaughan.png","sam hornishjr.png","joey hand.png","cody ware.png",
 "bill champion.png","ron keselowski.png","kevin lepage.png","elmo henderson.png","buren skeen.png","pedro rodriguez.png","worth mcmillion.png",
 "jimmy hensley.png","marty robbins.png","terry bivins.png","grant adcox.png","randy lajoie.png","daniel hemric.png","johnny sauter.png","larry pearson.png","travis kvapil.png","jimmy helms.png","ed hessert.png"
 ,"freddy fryar.png","dick may.png","janet guthrie.png","tony raines.png","danica patrick.png","kaz grala.png","anthony alfredo.png","roz howard.png","hoss ellington.png",
 "larry hess.png","billy foster.png","tommy gale.png","jimmy means.png","bj mcleod.png","parker retzlaff.png","connor zilisch.png","roscoe thompson.png","red wickersham.png","ken bouchard.png","butch miller.png",
 "tommy kendall.png",

  "buckshot jones.png","david stremme.png","brett moffitt.png","justin allgaier.png","riley herbst.png","jim sauter.png","stan barrett.png","don whittington.png","rodney combs.png",
 "rob moroso.png","ron hornadayjr.png","gray gaulding.png","matt tifft.png","brennan poole.png","austin hill.png","roger hamby.png","bob potter.png","wes morgan.png","jim bown.png",
 "loy allen.png","stacy compton.png","jason leffler.png","brian simo.png","josh wise.png","josh bilicki.png","bobby hamiltonjr.png","bill wimble.png","ken miles.png","jack bowsher.png","tommy houston.png","ken ragan.png",
 "jack pennington.png","cole whitt.png","jeffrey earnhardt.png","travis pastrana.png","chandler smith.png","charlie chapman.png","bill whiteley.png",
 "butch leitzinger.png","jeff purvis.png","david green.png","jan magnussen.png","justin marks.png","jimmy horton.png","scott lagasse.png","blackie wangerin.png","dorsey schoeder.png","michael annett.png",
 "dj kennington.png","quinn houff.png","billy standridge.png","elton saywer.png","jack sprague.png","timmy hill.png","phil barkdoll.png","parker kligerman.png","roland wloydka.png",
 "randy ogden.png","rick hendrick.png","roger baldwin.png","dave alonzo.png","al laqusto.png","mark stahl.png","larry foyt.png","ray black jr.png","pancho carter.png","david hobbs.png","delma cowart.png","kerry earnhardt.png",
 "chad mccumbee.png","joey gase.png","katherine legge.png","smokey yunick.png","bill venturini.png","hermie sadler.png","andy lally.png","matt crafton.png","jenson button.png",
 "bobby gerhart.png","scott sharp.png","mike rockenfeller.png","tracy laslie.png","davy jones.png","ed berrier.png","kirk shelmerdine.png",

 "ryan truex.png","rick carelli.png","terry schoonover.png","larry caudill.png","stanley smith.png","jerry oneil.png","brent sherman.png","garrett smithley.png","dick johnson.png",
 "willy tribbs.png","mike mclaughlin.png","ron barfield.png","jeff fuller.png","dario franchitti.png","billy johnson.png","harrison rhodes.png","james davison.png","gary bradberry.png",
 "stewart friesen.png","david starr.png","Jocko Maggiacomo","butch gilliland.png","shane hmeil.png","tom herbert.png","stephen leicht.png","sarel verde.png","shawna robinson.png","tom hubert.png","christian fittipaldi.png",
 "ryan sieg.png","jordan taylor.png","jesse love.png","josh williams.png","ritchie petty.png","jay hedgecock.png","mike garvey.png","alex kennedy.png","dylan lupton.png","bayley currey.png",
 "derek kraus.png","curtis markham.png","patty moise.png","frank kimmel.png","jason keller.png","eric mcclure.png","andy pilgrim.png","nelson piquet jr.png","ryan reed.png",
 "kyle weatherman.png","scott heckert.png","grant enfinger.png","brian ross.png","jerry hill.png","ed ferre.png","steve kinser.png","joe bessey.png","jeb burton.png","kevin magnussen.png",
 "andy belmont.png","bryan baker.png","brent kaeding.png","scott gaylord.png","carl long.png","andy seuss.png","chad finchum.png","jason jarrett.png","jon wood.png","erik darnell.png",
 "drew herring.png","conor daly.png","kimi raikkonen.png","sheldon creed.png","kamui kobayashi.png","norm benning.png","stan barrett.png","jim clark.png","kyle tilley.png",
 "sammy swindell.png","chad chaffin.png","ben rhodes.png","sam ard.png","jeff swindell.png","tony ave.png","stuart kirby.png","tanner berryhill.png",

 "mike marlar.png","will brown.png","bill lester.png","todd kleuver.png","austin therialt.png","alon day.png","tomy drissi.png","loris hezemans.png","hank parkerjr.png",
 "hideo fukuyama.png","larry gunselmen.png","mike olsen.png","kevin oconnel.png","chris windom.png","tim sauter.png","terry cook.png",
 "tommy regan.png","spencer boyd.png","rc enerson.png","mike dillon.png","spencer gallagher.png",
 "cameron waters.png","daniil kvyat.png","al unser jr.png","shane hall.png","johnathon davenport.png","burt myers.png","gary mayeda.png","jay sauter.png",
 "victor gonzalez.png","shane golobic.png","denny wilson.png","geoff brabham.png","austin cameron.png",
 "will kimmell.png","brian keselowski.png","matt mills.png","derek white.png","ryan eversley.png","helio castroneves.png","jack sellers.png","bobby rahal.png","adam petty.png"
 ,"jason small.png","chad blount.png","jason hedlesky.png","bob keselowski.png","wayne anderson.png"
];

const IMAGES_PER_ROW = 8;
const ROWS_PER_CONTAINER = 10;

function buildWall() {

    const containers = getVisibleContainers();

    containers.forEach(container => {
        container.innerHTML = "";
    });

    const singleColumn = window.innerWidth <= 1133;

    containers.forEach((container, containerIndex) => {

        for (let row = 0; row < ROWS_PER_CONTAINER; row++) {

            for (let col = 0; col < IMAGES_PER_ROW; col++) {

                const tile = document.createElement("div");

                let imageIndex;

                if (singleColumn) {

                    imageIndex =
                        containerIndex * 80 +
                        row * 8 +
                        col;
                }

                else {

                    if (containerIndex <= 1) {

                        imageIndex =
                            Math.floor(row / 2) * 32 +
                            (row % 2) * 16 +
                            containerIndex * 8 +
                            col;
                    }

                    else if (containerIndex <= 3) {

                        imageIndex =
                        160 +
                        Math.floor(row / 2) * 32 +
                        (row % 2) * 16 +
                        (containerIndex - 2) * 8 +
                        col;
                    }

                    else {

                        imageIndex =
                            320 +
                            (containerIndex - 4) * 80 +
                            row * 8 +
                            col;
                    }
                }

                if (imageIndex < wallImages.length) {

                    const img = document.createElement("img");

                    img.src = `wallimgss/${wallImages[imageIndex]}`;
                    img.loading = "lazy";

                    tile.appendChild(img);

                    tile.addEventListener("click", function () {

                        image.style.backgroundImage =
                            `url('drvimgs/${wallImages[imageIndex]}')`;
                            currentIndex = imageIndex;
                    });
                }

                container.appendChild(tile);
            }
        }
    });
}

buildWall();

window.addEventListener("resize", buildWall);



let currentIndex = 0;


image.style.backgroundImage = `url('drvimgs/${wallImages[currentIndex]}')`;

rightArrow.addEventListener("click", function() {
    currentIndex++;
    if (currentIndex >= wallImages.length){
    currentIndex = 0;
}

    image.style.backgroundImage = `url('drvimgs/${wallImages[currentIndex]}')`;
});
leftArrow.addEventListener("click", function() {
    currentIndex--;
    if (currentIndex < 0){
    currentIndex = wallImages.length - 1;
}

    image.style.backgroundImage = `url('drvimgs/${wallImages[currentIndex]}')`;
});



console.log(currentIndex);
