require 'json_schemer'
require 'yaml'

raise 'syntax: validate [spec]' unless ARGV.length >= 1

spec = ARGV[0]
puts "Validating #{spec} ..."

schemer = JSONSchemer.openapi(YAML.load_file(spec))
schemer.validate

total_errors = 0
schemer.validate.each do |error|
  puts "#{error['data']}: #{error['error']}" if total_errors < 10
  total_errors += 1
end

puts total_errors > 0 ? " .... #{total_errors} total." : "Done."

exit total_errors == 0 ? 0 : 1
