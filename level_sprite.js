function LevelSprite() {
    this.file = "resources/images/borders.png";
    this.file2 = "resources/images/roads.png";
    this.height = 16;
    this.width = 16;
    this.spriteImage = new Image();
    this.spriteImage.src = this.file;
    this.roadSprite = new Image();
    this.roadSprite.src = this.file2;
}

LevelSprite.prototype.renderTile = function(row, col, world, context, render_row, render_col){
    if (world.getCellAt(row , col).isPath()){
        this.renderPath(row, col, world, context, render_row, render_col);
    } else {
        this.renderWall(row, col, world, context, render_row, render_col);
        
    }
};

LevelSprite.prototype.renderPath = function(row, col, world, context, render_row, render_col){
    context.drawImage(this.roadSprite, 32, 0, 16, 16, render_col*16,render_row*16, 16, 16);
    if ((world.getCellAt(row - 1, col).isWall() || world.getCellAt(row + 1, col).isWall()) && col % 2 == 0 
        && !(world.getCellAt(row, col-1).isWall() || world.getCellAt(row , col+ 1).isWall())
){
        context.drawImage(this.roadSprite, 16, 0, 16, 16, render_col*16,render_row*16, 16, 16);
    }
    
    if ((world.getCellAt(row , col- 1).isWall() || world.getCellAt(row , col+ 1).isWall()) && row % 2 == 0 
        && !(world.getCellAt(row-1, col).isWall() || world.getCellAt(row+ 1 , col).isWall())
){
        context.drawImage(this.roadSprite, 0, 0, 16, 16, render_col*16,render_row*16, 16, 16);         
    }


    if (world.getCellAt(row+1,col-1).isPath() && world.getCellAt(row+1,col).isPath() && world.getCellAt(row,col-1).isWall() && world.getCellAt(row-1,col).isPath()){
        context.drawImage(this.roadSprite,0,16, 16, 16, render_col*16,render_row*16, 16, 16);    
        context.drawImage(this.roadSprite, 32, 0, 16, 16, render_col*16,(render_row+1)*16, 16, 16);     
    }

    if (world.getCellAt(row,col+1).isPath() && world.getCellAt(row+1,col+1).isPath() && world.getCellAt(row+1,col).isWall() && world.getCellAt(row,col-1).isPath()){
        context.drawImage(this.roadSprite,16,16, 16, 16, render_col*16,render_row*16, 16, 16);  
        context.drawImage(this.roadSprite, 32, 0, 16, 16, (render_col+1)*16,render_row*16, 16, 16);          
    }

    if (world.getCellAt(row-1,col-1).isPath() && world.getCellAt(row,col-1).isPath() && world.getCellAt(row-1,col).isWall() && world.getCellAt(row,col+1).isPath()){
        context.drawImage(this.roadSprite,32,16, 16, 16, render_col*16,render_row*16, 16, 16);   
        context.drawImage(this.roadSprite, 32, 0, 16, 16, (render_col-1)*16,render_row*16, 16, 16);          
    }

    if (world.getCellAt(row-1,col+1).isPath() && world.getCellAt(row-1,col).isPath() && world.getCellAt(row,col+1).isWall() && world.getCellAt(row+1,col).isPath()){
        context.drawImage(this.roadSprite,0,32, 16, 16, render_col*16,render_row*16, 16, 16);       
        context.drawImage(this.roadSprite, 32, 0, 16, 16, render_col*16,(render_row-1)*16, 16, 16);
    }

if (world.getCellAt(row-1,col-1).isPath() && world.getCellAt(row+1,col+1).isPath() && world.getCellAt(row+1,col-1).isPath() && world.getCellAt(row-1,col+1).isPath()){
    context.drawImage(this.roadSprite,16,32, 16, 16, render_col*16,render_row*16, 16, 16);       
}


    


    // var idx = 0;
    // if (world.getCellAt(row -1 , col).isPath()) idx += 1;
    // if (world.getCellAt(row, col + 1).isPath()) idx += 2;
    // if (world.getCellAt(row + 1, col).isPath()) idx += 4;
    // if (world.getCellAt(row, col - 1).isPath()) idx += 8;
    

    // if (world.getCellAt(row-1,col-1).isPath() && world.getCellAt(row-1, col).isWall() && world.getCellAt(row, col-1).isWall()){
    //     context.drawImage(this.spriteImage, 0, 256 + 0*16, 16, 16, render_col*16,render_row*16, 16, 16);
    // }
    // if (world.getCellAt(row-1,col+1).isPath() && world.getCellAt(row-1, col).isWall() && world.getCellAt(row, col+1).isWall()){
    //     context.drawImage(this.spriteImage, 0, 256 + 1*16, 16, 16, render_col*16,render_row*16, 16, 16);
    // }
    // if (world.getCellAt(row+1,col+1).isPath() && world.getCellAt(row+1, col).isWall() && world.getCellAt(row, col+1).isWall()){
    //     context.drawImage(this.spriteImage, 0, 256 + 2*16, 16, 16, render_col*16,render_row*16, 16, 16);
    // }
    // if (world.getCellAt(row+1,col-1).isPath() && world.getCellAt(row+1, col).isWall() && world.getCellAt(row, col-1).isWall()){
    //     context.drawImage(this.spriteImage, 0, 256 + 3*16, 16, 16, render_col*16,render_row*16, 16, 16);
    // }
};

LevelSprite.prototype.renderWall = function(row, col, world, context, render_row, render_col){
    var idx = 0;
    if (world.getCellAt(row -1 , col).isPath()) idx += 1;
    if (world.getCellAt(row, col + 1).isPath()) idx += 2;
    if (world.getCellAt(row + 1, col).isPath()) idx += 4;
    if (world.getCellAt(row, col - 1).isPath()) idx += 8;
    context.drawImage(this.spriteImage, 0, idx * 16, 16, 16, render_col*16,render_row*16, 16, 16);

    if (world.getCellAt(row-1,col-1).isPath() && world.getCellAt(row-1, col).isWall() && world.getCellAt(row, col-1).isWall()){
        context.drawImage(this.spriteImage, 0, 256 + 0*16, 16, 16, render_col*16,render_row*16, 16, 16);
    }
    if (world.getCellAt(row-1,col+1).isPath() && world.getCellAt(row-1, col).isWall() && world.getCellAt(row, col+1).isWall()){
        context.drawImage(this.spriteImage, 0, 256 + 1*16, 16, 16, render_col*16,render_row*16, 16, 16);
    }
    if (world.getCellAt(row+1,col+1).isPath() && world.getCellAt(row+1, col).isWall() && world.getCellAt(row, col+1).isWall()){
        context.drawImage(this.spriteImage, 0, 256 + 2*16, 16, 16, render_col*16,render_row*16, 16, 16);
    }
    if (world.getCellAt(row+1,col-1).isPath() && world.getCellAt(row+1, col).isWall() && world.getCellAt(row, col-1).isWall()){
        context.drawImage(this.spriteImage, 0, 256 + 3*16, 16, 16, render_col*16,render_row*16, 16, 16);
    }
};