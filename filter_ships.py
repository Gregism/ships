import csv
#writer = csv.writer(open ('data/filtered_ships.csv','w') , delimiter=' ')
#reader = csv.reader(open('data/ships.csv','r'), delimiter=' ')        
#included_cols = [1,2,5,9,11,18,19,30]
#for row in reader:
#  print ", ".join(list(row[i] for i in included_cols))

  #content = list(row[i] for i in included_cols)
  #writer.writerow(content)

output = []

f = open( 'data/ships.csv', 'rU' ) #open the file in read universal mode
count = 0
for line in f:
    cells = line.split( "," )
    if (count == 0 or cells [19] == '01/07/2014' ):
      count += 1
      output.append( ( cells[ 1 ], cells[ 2 ], cells[ 5 ], cells [9], cells [11], cells [18], cells [19], cells [30], ) ) #since we want the first, second and third column

f.close()

w= open( 'data/filtered_ships.csv', 'wb' )
wr = csv.writer(w)
wr.writerows(output)
  
#print output