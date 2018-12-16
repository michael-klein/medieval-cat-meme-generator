i=0
for fi in cat*.png; do
    mv "$fi" cat_$i.jpg
    i=$((i+1))
done
