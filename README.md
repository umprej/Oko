# Semestrální práce karetní hra Jednadvacet (Oko)
Vaším úkolem je naprogramovat karetní hru Oko tak, abyste mohli hrát proti počítači.

Cílem hry Oko je dosáhnout kombinací karet vyššího součtu než ostatní soupeři. Tento součet však nesmí překročit číslo 21. Pokud se tak stane, automaticky kolo prohráváte. Bodové hodnoty karet jsou následující: karty 7 – 10 si své hodnoty ponechávají, svršek a spodek mají hodnotu 1, král hodnotu 2 a eso hodnotu 11.

Hráči disponují omezeným rozpočtem, který používají pro sázky v jednotlivých kolech. Rozpočet mají rovnoměrně rozdělený na tři části (životy). Pokaždé, když celou část prohrají, přicházejí o jeden život. V případě, že životy dojdou, hráč prohrál všechny životní úspory a definitivně končí. Stav životů je vykreslován pomocí Canvasu.

## Požadované vlastnosti

Hráč musí mít stále přehled o částce, která momentálně zbývá v jeho peněžence. Výše vstupního rozpočtu je na vás.

Hráč musí mít možnost vsadit pouze částku větší než 0 a ne vyšší než má k dispozici.

Ve chvíli kdy si hráč vsadí, si musí vzít kartu. Podle bodového zisku se rozhoduje, zda chce další kartu, nebo už má dost. Program průběžně kontroluje, zda hráč nepřekročil 21. Po skončení hra vyhodnotí, kdo byl blíž 21. Podle toho vyplatí sázky. Hráč nesmí mít možnost utéct před vyhodnocením.

V případě, že hráč nepřekonal 21, ať prohrál, nebo vyhrál, bude informován, jaké karty táhl počítač.

Karty mají svá slovní označení a hodnoty. Tedy karta není 7, ale „žaludská sedmička“.

Zahraná karta již nemůže být tažena. Přece jen karta byla již odhozena stranou, tak ji nemůže hráč znovu vytáhnout.

V případě, že hráč přišel o veškeré peníze i životy, hra mu tuto skutečnost oznámí a vše se znepřístupní. Hru je možné vždy uvést do počátečního stavu tlačítkem reset.

Hru je možné „vyhrát“ odchodem z podniku tlačítkem odejít, než přijde hráč o veškeré peníze. Tato možnost opět vše znepřístupní.
