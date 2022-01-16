count = int(input())
inp_arr = []

for i in range(count):
	num = int(input())
	inp_arr.append(num)

odd_count = 0
even_count = 0
positive_count = 0
negative_count = 0
zero_count = 0

for i in range(len(inp_arr)):
	if inp_arr[i]==0:
		zero_count += 1

	if inp_arr[i]>=0:
		positive_count += 1
	else:
		negative_count += 1


	if abs(inp_arr[i])%2==0 and inp_arr[i]!=0:
		even_count += 1
	if abs(inp_arr[i])%2!=0:
		odd_count += 1


print("Number of positive numbers = ", positive_count)
print("Number of Negative numbers = ", negative_count)
print("Number of Zero's = ", zero_count)
print("Number of Odd numbers = ", odd_count)
print("Number of even numbers = ", even_count)