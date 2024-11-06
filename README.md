# Krabbenkuhlen

crab-chilling


## Partie 2 
### Phase A
#### 1.1 Expliquer les avantages et inconvénients de Node.js pour ce type d’activité

Pour les avantages:
Dans le cas d'un chat en temps réel, NodeJs est plutôt intéressant car il permet une gestion des websock via la lib Socket.IO. 
Comme le front va également être fait avec NodeJS, la compatibilité entre les deux sera simplifié.
La gestion des évènements asynchrone pour gérer un grand nombre de connexions est un atout de taille.
NodeJS s'intègre bien avec les outils de scalabilité horizontale, on peut donc imaginer avec plusieurs instances en fonction du nombre d'utilisateurs et donc respecter notre architecture orientée micro-services.
L'écosystèmes JavaScript/NodeJS est très prolifique et les lib comme express permettent de mettre en place un serveur web très rapidement.
Dans le cas où une bdd NoSQL est mise en place, l'intégration avec NodeJS est simplifiée (surtout avec MongoDB) et rend le tout plus rapide à développer et facile à maintenir.

Pour les inconvénients:
NodeJS n'utilise qu'un seul core du CPU, cela implique que les performances font s'en retrouver impactées comparé à Java/.NET. 
Le manque de type peu aussi amener à plus de liberté pour les développeurs mais aussi plus de comportement imprévus. 
Cela peut être corrigé partiellement par TypeScript.
NodeJS est également une technologie plus récente que Java/.NET et donc certaines lib peuvent manquer de maturité ou avoir des évolutions non retro-compatibles.
Le systèmes asynchrone de NodeJS est bon, mais peut parfois amener de la complexité non nécessaire, notamment pour tout ce qui va être des traitements plus intenses.

Conclusion:
Il faut utiliser les backend NodeJS avec parcimonie. Cette technologie est très pertinente dans certains cas, mais ne doit pas être sur-utilisé.

