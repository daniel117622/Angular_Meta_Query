
## Why work in this extension?
  -- Frontend applications can grow so complex to the point that is hard to make changes. While there is software that allows you to view your dependencies chains, your code-smells and other statistics like that
  they are annoying or slow to work with, and I guess most people who work on their projects have a mental image on how the dataflows are ocurring in this application. Instead of going to those code analyzers and 
  mess around with those slow and confusing interfaces ( ~~sonarcloud~~ ). Why not just type something like: <br />
     ***"/select inline_styles from blog.component.html => moveIntoCSSClass => blog.component.scss"*** : Effectively move your inlined styles into stylesheets as it should be. Performs aggrupation and uses the most appropiate selector automatically<br />
    ***"/select input from blog.component.ts where input='someField' into X => move X into register.component.ts"*** : Removes that field from the @Input and removes the bindings associated with it<br /><br />

  This are some examples, but well the extensions aims at providing queries that could help developers to code and refactor faster. Yes there are tools for that, but wouldn't it be cool something quick and intuitive to use?
  Think about this as a find and replace on steroids extension!

  

## Secrets : 
Currently you need to implement a class to point to your desired mongo URL.
For some reason extensions enviroment is tricky

## Experiments :
Here you find python source files. This are mostly to retrieve stats about how people use angular components. Python could be useful to extract data and
get a better view of common design patterns and posible optimizations for good coding practices that this extension could achieve. 

## Current status: 
For the moment I will be analyzing how people use inline styles to get a better idea what source to source command work first, of course... to make this decision I will have to evaluate how 
hard is that task and how useful it is. I tend to abuse inline styles a lot while creating my components, so thats why I am working in that command, but maybe there are better things
that this extension could do. 
